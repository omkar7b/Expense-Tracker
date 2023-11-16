const express = require('express');
const router = express.Router();
const {forgotPassword, resetPassword, udpatePassword} = require('../controllers/resetPassword');


router.get('/resetpassword/:id', resetPassword);
router.use('/updatepassword/:id', udpatePassword);
router.post('/forgotPassword', forgotPassword);


module.exports = router;