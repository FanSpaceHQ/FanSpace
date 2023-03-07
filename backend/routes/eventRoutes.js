const express = require('express');
const router = express.Router();
const { getEvent } = require('../controllers/eventController');


router.get('/:id', getEvent);

module.exports = router;