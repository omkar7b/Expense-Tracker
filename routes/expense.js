const express = require('express');
const router = express.Router();
const { addExpense, getExpense, deleteExpense } = require('../controllers/expense');
const userauthentication = require('../middleware/auth')

router.post('/add-expense', userauthentication.authenticate, addExpense);
router.get('/get-expense', userauthentication.authenticate, getExpense);
router.delete('/delete-expense/:id',  userauthentication.authenticate, deleteExpense);


module.exports = router;