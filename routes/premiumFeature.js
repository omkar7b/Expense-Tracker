const express = require('express');
const router = express.Router();
const {getLeaderboard} = require('../controllers/premiumFeature');
const userAuthentication = require('../middleware/auth');

router.get('/showleaderboard', userAuthentication.authenticate, getLeaderboard);

module.exports = router;