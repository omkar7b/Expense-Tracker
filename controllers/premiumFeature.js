const User = require('../models/users');
const Expense = require('../models/expense');
const sequelize = require('../util/database');
const DownloadedFiles = require('../models/downloadedFiles.js');
const AWS = require('aws-sdk');

exports.getLeaderboard = async (req, res) => {
    try {
        const userAggregatedExpenses = await User.findAll({
            order:  [[('totalExpense'), 'DESC']]
        });
        console.log(userAggregatedExpenses);
        res.status(200).json(userAggregatedExpenses);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

function uploadToS3(data, filename){
    
    let s3bucket = new AWS.S3({
        accessKeyId: process.env.IAM_USER_KEY,
        secretAccessKey: process.env.IAM_USER_SECRET,
        //Bucket: BUCKET_NAME
    });

        let params = {
            Bucket: process.env.BUCKET_NAME,
            Key: filename,
            Body: data,
            ACL: 'public-read' // Access Control Level
        }

    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3response) =>{
            if(err) {
             console.log('Something Went Wrong');
             reject(err);
            } else {
             console.log('success', s3response);
              resolve(s3response.Location);
            }
         })
    })
}

exports.downloadExpense = async (req, res, next) => {
    try {
        if (!req.user.ispremiumuser) {
            return res.status(401).json({ message: 'Buy Premium to Download Report', success: false });
        }

        const expenses = await req.user.getExpenses();
        const stringifiedExpenses = JSON.stringify(expenses);
        const userId = req.user.id;

        const filename = `Expense${userId}/${new Date()}.txt`; // need according to the user, depend upon username who is downloading it.
        const fileURL = await uploadToS3(stringifiedExpenses, filename);

        const downloadedFile = DownloadedFiles.create({
            fileURL: fileURL,
            date: sequelize.literal('CURDATE()'),
            userId: req.user.id, // Make sure to include the userId if it's not automatically set
        });

        res.status(200).json({ fileURL, success: true });
    } catch (error) {
        res.status(500).json({ fileURL: '', success: false, error: error });
        console.log(error);
    }
};


exports.recentlyDownloadedFiles = async (req,res, next) => {
    try {
        const recentdownloadedfiles = await DownloadedFiles.findAll({where: {userId: req.user.id}});
        res.status(200).json(recentdownloadedfiles);
    } catch (err){
        res.status(500).json(error)
    }
    
}



// const userAggregatedExpenses = await User.findAll({
//     attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('expenses.amount')), 'totalExpense']],
//     include: [
//         {
//             model: Expense,
//             attributes: []
//         }
//     ],
//     group: ['users.id'],
//     order: [[('totalExpense'), 'DESC']]
// });



// const expenses = await Expense.findAll({
        //     attributes: ['userId', [sequelize.fn('SUM', sequelize.col('expenses.amount')), 'total_cost']],
        //     group: ['userId']
        // });
        
        //const userAggregatedExpenses = {};
        // expenses.forEach(expense => {
        //     if (userAggregatedExpenses[expense.userId]) {
        //         userAggregatedExpenses[expense.userId] += expense.amount;
        //     } else {
        //         userAggregatedExpenses[expense.userId] = expense.amount;
        //     }
        // });

        // const userLeaderboardDetails = [];
        // users.forEach((user) => {
        //     userLeaderboardDetails.push({
        //         name: user.name, 
        //         totalExpense: userAggregatedExpenses[user.id] || 0 // Use 0 if no expenses found
        //     });
        // });
        // console.log(expenses);
        // userLeaderboardDetails.sort((a,b) => b.totalExpense-a.totalExpense);