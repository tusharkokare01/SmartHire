import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['candidate', 'hr'], default: 'candidate' },
    subscriptionStatus: { type: String, enum: ['free', 'active', 'canceled', 'past_due'], default: 'free' },
    subscriptionId: { type: String },
    customerId: { type: String },
    couponApplied: { type: String, default: null }, // Track which coupon was applied
    bio: { type: String },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false }
    },
    language: { type: String, default: 'en-US' },
    twoFactor: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;


