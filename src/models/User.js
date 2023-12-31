import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatarUrl: { type: String },
  socialOnly: { type: Boolean, default: false },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  // name: { type: String, required: true },
  birthday: { type: Date },
  gender: { type: String },
  joinedAt: Date,
  location: String,
});

userSchema.pre('save', async function () {
  // console.log('users password: ', this.password);
  this.password = await bcrypt.hash(this.password, 5);
  // console.log('hashed password: ', this.password);
});

const User = mongoose.model('User', userSchema);
export default User;
