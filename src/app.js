const express = require('express');
const morgan = require('morgan');

const env = require('./config/env');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

if (env.env !== 'production') {
  app.use(morgan('dev'));
}

app.use(express.json()); //adds body (post) to req
app.use(express.static(`${__dirname}/../public`)); // serves static files in public folder

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

module.exports = app;
