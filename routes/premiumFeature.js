const express = require('express');
const router = express.Router();
const {getLeaderboard, downloadExpense, recentlyDownloadedFiles} = require('../controllers/premiumFeature');
const userAuthentication = require('../middleware/auth');

router.get('/showleaderboard', userAuthentication.authenticate, getLeaderboard);
router.get('/download',userAuthentication.authenticate, downloadExpense);
router.get('/recentdownload', userAuthentication.authenticate, recentlyDownloadedFiles);

module.exports = router;