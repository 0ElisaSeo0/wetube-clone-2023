import express from 'express';
import morgan from 'morgan';
import rootRouter from './routers/rootRouter';
import userRouter from './routers/userRouter';
import videoRouter from './routers/videoRouter';

const app = express();

app.set('view engine', 'pug');
app.set('views', process.cwd() + '/src/views');
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
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
