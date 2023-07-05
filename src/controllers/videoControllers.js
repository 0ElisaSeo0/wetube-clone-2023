// const fakeUser = {
//   username: 'Nico',
//   loggedIn: false,
// };

import Video from '../models/Video';

// Video.find({})
//   .then(function (videos) {
//     console.log(videos);
//   })
//   .catch(function (error) {
//     console.log('error');
//   });

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ createdAt: -1 });
    return res.render('home', {
      pageTitle: 'Home',
      videos,
    });
  } catch {
    return res.render('server-error');
  }
};
export const see = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  // console.log(req.params);
  // console.log(`Watch a video #${req.params.title}`);
  if (!video) {
    return res.status(404).render('404', { pageTitle: 'video not found.' });
  }
  return res.render('watch', { pageTitle: video.title, video: video });
};
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render('404', { pageTitle: 'video not found.' });
  }
  return res.render('Edit', { pageTitle: `Editing ${video.title}`, video });
};
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.status(404).render('404', { pageTitle: 'video not found.' });
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
  return res.render('Upload', { pageTitle: `Uploading: videos` });
};
export const postUpload = async (req, res) => {
  const { uploadedTitle, description, hashtags } = req.body;
  try {
    await Video.create({
      title: uploadedTitle,
      description,
      createdAt: Date.now(),
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect('/');
  } catch (err) {
    console.log(err);
    return res.render('Upload', {
      pageTitle: `Uploading: videos`,
      errorMessage: err._message,
    });
  }
};
export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  await Video.findByIdAndDelete(id);
  return res.redirect('/');
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  // let videos = [];
  if (keyword) {
    const videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, 'i'),
      },
    });
    return res.render('search', { pageTitle: 'Search', videos });
  }
  return res.render('search', { pageTitle: 'Search' });
};
