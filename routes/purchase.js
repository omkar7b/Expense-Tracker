const express = require('express');
const router = express.Router();
const Order = require('../models/orders');
const authenticatemiddleware = require('../middleware/auth');
const {purchasePremium, updateTransactionStatus, showPremium } = require('../controllers/purchase');

router.get('/premiummembership', authenticatemiddleware.authenticate, purchasePremium);
router.post('/updatetransactionstatus',authenticatemiddleware.authenticate, updateTransactionStatus);
router.get('/ispremium', authenticatemiddleware.authenticate, showPremium);

module.exports = router;