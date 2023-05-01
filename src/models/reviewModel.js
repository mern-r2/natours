const mongoose = require('mongoose');

const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Only 1 review per user for a tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

// Static method: 'this' is the current model also
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// it is a 'post' so the it executes after the doc is saved on db (we have all values)
reviewSchema.post('save', function () {
  // Cannot use 'Review.calcAverageRating - only defined at the end of the file
  this.constructor.calcAverageRatings(this.tour);
});

// Only query middleware for findByIdAndUpdate/findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.queryReview = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // 'this.findOne()' has to be on 'pre' function, here the query has already executed
  await this.queryReview.constructor.calcAverageRatings(this.queryReview.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
