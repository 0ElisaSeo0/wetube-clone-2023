import User from '../models/User';
import fetch from 'node-fetch';
import bcrypt from 'bcrypt';

export const getJoin = (req, res) => res.render('join', { pageTitle: 'Join' });
export const postJoin = async (req, res) => {
  const { username, email, password, password2, location } = req.body;
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
      username,
      email,
      password,
      location,
      joinedAt: new Date(),
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
  const user = await User.findOne({ username, socialOnly: false });

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
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect('/');
};

export const startKakaoLogin = (req, res) => {
  const baseUrl = 'https://kauth.kakao.com/oauth/authorize';
  const config = {
    client_id: process.env.KAKAO_CLIENT,
    redirect_uri: 'http://localhost:4000/users/kakao/finish',
    response_type: 'code',
    property_keys: 'kakao_account',
  };
  // console.log(`config: ${config.scope}`);
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishKakaoLogin = async (req, res) => {
  const baseUrl = 'https://kauth.kakao.com/oauth/token';
  const config = {
    grant_type: 'authorization_code',
    client_id: process.env.KAKAO_CLIENT,
    redirect_uri: 'http://localhost:4000/users/kakao/finish',
    client_secret: process.env.KAKAO_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: 'POST',
      // headers: {
      //   Content-type: 'application/x-www-form-urlencoded',
      // },
    })
  ).json();
  console.log(`tokenRequest: ${JSON.stringify(tokenRequest)}`);
  if ('access_token' in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = 'https://kapi.kakao.com/v2/user/me';
    const userData = await (
      await fetch(`${apiUrl}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();
    console.log(`userData : ${JSON.stringify(userData)}`);
    // const emailData = await (
    //   await fetch(`${apiUrl}/user/emails`, {
    //     headers: {
    //       Authorization: `token ${access_token}`,
    //     },
    //   })
    // ).json();
    // console.log(`emailData: ${JSON.stringify(emailData)}`);
    const kakaoAccount = userData.kakao_account;
    const kakaoProfile = kakaoAccount.profile;
    console.log(`kakaoAccount: ${JSON.stringify(kakaoAccount)}`);
    console.log(`kakaoProfile: ${JSON.stringify(kakaoProfile)}`);

    if (
      !(
        kakaoAccount.is_email_valid === true &&
        kakaoAccount.is_email_verified === true
      )
    ) {
      return res.redirect('/login');
    }
    let user = await User.findOne({ email: kakaoAccount.email });
    console.log(`user: ${user}`);
    if (!user) {
      user = await User.create({
        // name: kakaoProfile.nickname,
        username: kakaoProfile.nickname,
        email: kakaoAccount.email,
        password: '',
        socialOnly: true,
        avatarUrl: kakaoProfile.profile_image_url,
        location: '',
        joinedAt: userData.connected_at,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect('/');
  } else {
    return res.redirect('/login');
  }
  // console.log(json);
  // res.send(JSON.stringify(json));
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect('/');
};
export const getEdit = (req, res) => {
  return res.render('edit-profile', { pageTitle: 'Edit Profile' });
};
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { gender, birthday, username },
  } = req;
  // console.log(`userId: ${req.session.user.id}`);
  // const id = req.session.user.id;
  // const { gender, birthday, username } = req.body;
  console.log();
  const existingUser = await User.findOne({ username: username });
  if (existingUser._id != _id) {
    return res.status(400).render('edit-profile', {
      errorMessage: 'The username is already taken.',
    });
  } else {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { gender, birthday, username },
      { new: true }
    );
    req.session.user = updatedUser;
    return res.render('edit-profile');
  }
};
export const see = (req, res) => res.send('See users');
