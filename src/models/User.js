'use strict';

import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required!'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required!'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required!'],
      trim: true,
    },
    token: {
      type: String,
      default: null,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

UserSchema.pre('save', async function (next) {
  // Si el pass ya esta hasheado NO lo vuelve a hashear
  if (!this.isModified('password')) return next();

  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  next();
});

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  user.uid = user._id;

  delete user.password;
  delete user._id;

  return user;
};

export default model('User', UserSchema);
