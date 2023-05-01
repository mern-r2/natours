const fs = require('fs');
const mongoose = require('mongoose');

const env = require('../config/env');
const Tour = require('../models/tourModel');
const Review = require('../models/reviewModel');
const User = require('../models/userModel');

mongoose.connect(env.db).then(() => console.log('DB connection successful!'));

// READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../../dev-data/data/tours.json`, 'utf-8')
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/../../dev-data/data/reviews.json`, 'utf-8')
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../../dev-data/data/users.json`, 'utf-8')
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    await Review.create(reviews);
    await User.create(users, { validateBeforeSave: false });
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await Review.deleteMany();
    await User.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// REMEMBER: Comment code to crypto the password (document middleware pre save)
// > node import-data.js --import
if (process.argv[2] === '--import') {
  importData(); // all users have password 'test1234'
} else if (process.argv[2] === '--delete') {
  deleteData();
}
