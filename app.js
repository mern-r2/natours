const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json()); //adds body (post) to req

const fileURI = `${__dirname}/dev-data/data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(fileURI));

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
}

const getTour = (req, res) => {
  const id = +req.params.id;
  const tour = tours.find(tour => tour.id === id);

  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(fileURI, JSON.stringify(tours), err => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  });
};

const deleteTour = (req, res) => {
  const id = +req.params.id;

  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not implemented',
  });
};

const creatUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not implemented',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not implemented',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not implemented',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not implemented',
  });
};

app.route('/api/v1/tours')
  .get(getAllTours)
  .post(createTour);

app.route('/api/v1/tours/:id')
  .get(getTour)
  .delete(deleteTour);

app.route('/api/v1/users')
  .get(getAllUsers)
  .post(creatUser);

app.route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

const port = 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});