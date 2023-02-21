const jwt = require('jsonwebtoken');

const env = require('../config/env');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

const signToken = (userId) =>
  jwt.sign({ id: userId }, env.jwtSecret, { expiresIn: env.expiresIn });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // User.create(req.body) lets anyone become an admin (or privileged roles)
  // an admin needs to be edited at db itself or special route to create admin
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUser, 201, res);
});
