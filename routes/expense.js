const express = require('express');
const router = express.Router();
const { addExpense, getExpense, deleteExpense, downloadExpense, recentlyDownloadedFiles } = require('../controllers/expense');
const userauthentication = require('../middleware/auth')

router.post('/add-expense', userauthentication.authenticate, addExpense);
router.get('/get-expense', userauthentication.authenticate, getExpense);
router.delete('/delete-expense/:id',  userauthentication.authenticate, deleteExpense);

router.get('/download',userauthentication.authenticate, downloadExpense);
router.get('/recentdownload', userauthentication.authenticate, recentlyDownloadedFiles);

module.exports = router;