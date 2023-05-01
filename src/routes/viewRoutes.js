const express = require('express');
const viewsController = require('../controllers/viewsController');

const router = express.Router();

router.get('/', viewsController.getOverview);
router.get('/tour/:slug', viewsController.getTour);
router.get('/login', viewsController.getLoginForm);
router.get('/me', viewsController.getAccount);

router.post('/submit-user-data', viewsController.updateUserData);

module.exports = router;
