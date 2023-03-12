const express = require('express');
const router = express.Router();
const { getEvent, addUserToEvent } = require('../controllers/eventController');


router.get('/:id', getEvent);

router.post('/:event/users/:uid/:field', addUserToEvent);

module.exports = router;