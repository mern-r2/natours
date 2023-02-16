const fs = require('fs');

const fileURI = `${__dirname}/../../dev-data/data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(fileURI));

exports.checkId = (req, res, next, val) => {
  if (val > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }

  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
}

exports.getTour = (req, res) => {
  const id = +req.params.id;
  const tour = tours.find(tour => tour.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
};

exports.createTour = (req, res) => {
  const newId = tours.length;
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

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  });
};