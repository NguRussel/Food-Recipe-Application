import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isMfaActive: {
    type: Boolean,
    default: false,
  },
  mfaSecret: {
    type: String,
    default: null,
  },
  twoFactorSecret: {
    type: String,
    default: null,
  },
}, 
{
  timestamps: true,
});
const User = mongoose.model("User", userSchema);
export default User;