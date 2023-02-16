const express = require('express');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
app.use(express.json()); //adds body (post) to req

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

const port = 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});