const express = require('express');
const morgan = require('morgan');

const env = require('./config/env');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const { AppError } = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

if (env.env !== 'production') {
  app.use(morgan('dev'));
}

app.use(express.json()); //adds body (post) to req
app.use(express.static(`${__dirname}/../public`)); // serves static files in public folder

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
