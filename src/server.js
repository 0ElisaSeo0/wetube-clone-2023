import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import rootRouter from './routers/rootRouter';
import userRouter from './routers/userRouter';
import videoRouter from './routers/videoRouter';
import { localsMiddleware } from './middlewares';

const app = express();

app.set('view engine', 'pug');
app.set('views', process.cwd() + '/src/views');
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: true,
    // cookie: {
    //   maxAge: 20000,
    // },
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

// app.use((req, res, next) => {
//   req.sessionStore.all((error, sessions) => {
//     console.log(sessions);
//     next();
//   });
// });

// app.get('/add-one', (req, res, next) => {
//   req.session.potato += 1;
//   return res.send(`${req.session.id}\n${req.session.potato}`);
// });

app.use(localsMiddleware);
app.use('/', rootRouter);
app.use('/videos', videoRouter);
app.use('/users', userRouter);

const logger = (req, res, next) => {
  // console.log(`${req.method} ${req.url}`);
  next();
};

// app.get('/', handleHome);

// app.get('/login', handleLogin);

export default app;
