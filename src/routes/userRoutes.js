const express = require('express');

const tourController = require('./../controllers/userController');

const userRouter = express.Router();

userRouter.route('/')
  .get(tourController.getAllUsers)
  .post(tourController.creatUser);

userRouter.route('/:id')
  .get(tourController.getUser)
  .patch(tourController.updateUser)
  .delete(tourController.deleteUser);

module.exports = userRouter;