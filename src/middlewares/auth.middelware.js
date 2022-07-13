'use strict';

import { User } from './../models';

export const checkLoginCredentials = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  const matchPass = await user?.comparePassword(password);
  if (!user || !matchPass)
    return res.status(401).json({
      ok: false,
      msg: 'There was a problem logging in. Check your email and password or create an account.',
    });

  // Check if it's a confirmed user
  if (!user.confirmed)
    return res.status(403).json({
      ok: false,
      msg: 'Your account has not been confirmed!',
    });

  return next();
};

export const checkIdToken = async (req, res, next) => {
  const { token } = req.params;

  const unconfirmedUser = await User.findOne({ token });
  if (!unconfirmedUser)
    return res.status(401).json({ ok: false, msg: 'Invalid token!' });

  return next();
};
