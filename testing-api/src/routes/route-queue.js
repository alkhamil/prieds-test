const router = require('express').Router();
const { queue } = require('../controllers');

router.post('/queue/generate', queue.generateQueue);

module.exports = router;