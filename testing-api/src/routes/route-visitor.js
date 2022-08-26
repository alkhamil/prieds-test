const router = require('express').Router();
const { visitor } = require('../controllers');

router.get('/visitor', visitor.getVisitor);

router.get('/visitor/:id', visitor.getVisitorByID);

router.post('/visitor/add', visitor.addVisitor);

router.post('/visitor/edit', visitor.editVisitor);

module.exports = router;