import User from '../models/User';
import bcrypt from 'bcrypt';

export const getJoin = (req, res) => res.render('join', { pageTitle: 'Join' });
export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  if (password !== password2) {
    return res.status(400).render('join', {
      pageTitle: 'Join',
      errorMessage: 'Password confirmation does not match',
    });
  }
  const exists = await User.exists({
    $or: [{ username: username }, { email: email }],
  });
  if (exists) {
    return res.status(400).render('join', {
      pageTitle: 'Join',
      errorMessage: 'This username/email is already taken',
    });
  }
  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    return res.redirect('/login');
  } catch (err) {
    console.log(err);
    return res.status(400).render('Join', {
      pageTitle: `Join`,
      errorMessage: err._message,
    });
  }
};
export const getLogin = (req, res) =>
  res.render('login', { pageTitle: 'Login' });

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  // console.log(req.body);
  // const exists = await User.exists({ username });
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(400).render('login', {
      pageTitle: 'Login',
      errorMessage: "An acount with this username doesn't exist",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render('login', {
      pageTitle: 'Login',
      errorMessage: 'Wrong password',
    });
  }
  return res.redirect('/');
};
export const edit = (req, res) => res.send('Edit users');
export const deleteUser = (req, res) => res.send('Delete users');
export const see = (req, res) => res.send('See users');
export const logout = (req, res) => res.send('Log Out');
