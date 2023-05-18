const express = require('express');
const router = express.Router();
const { getEvent, addUserToEvent, searchEvent, populateEvents } = require('../controllers/eventController');


router.get('/:id', getEvent);

router.post('/:event/users/:uid/:field', addUserToEvent);
router.put('/events', searchEvent);
router.get('/', populateEvents)
router.get('/search/:keyword', searchEvent);

module.exports = router;    