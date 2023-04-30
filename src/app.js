const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const env = require('./config/env');

const { AppError } = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

if (env.env !== 'production') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100, // 100 requests for the same IP
  windowMs: 60 * 60 * 1000, // for 1 hour
  message: 'Too many requests from this IP, please try again in an hour.',
});
app.use('/api', limiter);
app.use(helmet());

app.use(express.json({ limit: '10kb' })); //adds body (post) to req (max 10kb)
app.use(express.static(`${__dirname}/../public`)); // serves static files in public folder ('public' omitted from URL)

app.use(mongoSanitize()); // NoSQL injection sanitization (e.g. login with email: { "$gt": "" } matches all users)
app.use(xss()); // XSS sanitization
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
); // prevent http parameter pollution (e.g. sorting by 2 fields)

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
