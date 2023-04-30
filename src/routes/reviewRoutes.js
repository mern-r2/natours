const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// Merge to be able to use nested routes (tours/:tourId/reviews -> reviews/)
const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.route('/').get(reviewController.getAllReviews).post(
  authController.restrictTo('user'),
  // reviewController.setTourUserIds,
  reviewController.createReview
);

module.exports = router;
