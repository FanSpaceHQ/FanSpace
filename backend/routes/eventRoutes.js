const express = require('express');
const router = express.Router();
const { getEvent, addUserToEvent, searchEvent } = require('../controllers/eventController');


router.get('/:id', getEvent);

router.post('/:event/users/:uid/:field', addUserToEvent);
router.put('/events', searchEvent);

module.exports = router;    