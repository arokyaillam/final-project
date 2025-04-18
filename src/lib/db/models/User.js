import mongoose from 'mongoose';
import { hash, compare } from 'bcrypt';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password should be at least 6 characters'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  upstoxToken: {
    accessToken: String,
    refreshToken: String,
    expiresIn: Number,
    tokenType: String,
    expiresAt: Date,
  },
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    this.password = await hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return compare(candidatePassword, this.password);
};

// Prevent password from being sent in responses
UserSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.password;
    return ret;
  }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
