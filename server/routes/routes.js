const router = require('express').Router();
const { location } = require('../controllers/');

router.get('/location', location.getLocation);

module.exports = router;
