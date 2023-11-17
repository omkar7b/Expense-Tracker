const Expense = require('../models/expense.js');
const sequelize = require('../util/database.js');
require('dotenv').config();


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

// exports.downloadExpense = async (req,res, next) => {
//     try {
//         if(!req.user.ispremiumuser){
//             return res.status(401).json({message: 'Buy Premium to Download Report', success:false})
//         }
//     const expenses = await req.user.getExpenses();
//     const stringifiedExpenses = JSON.stringify(expenses);
//     //console.log('...',stringifiedExpenses);
//     const userId = req.user.id;

//     const filename = `Expense${userId}/${new Date()}.txt`; // need according to user, depend upon username who is downloading it.
//     const fileURL = await uploadToS3(stringifiedExpenses, filename);
//     const downloadedFile = DownloadedFiles.create({
//         fileURL: fileURL,
//         date: sequelize.literal('CURDATE()'),
//         userId: req.user.id, // Make sure to include the userId if it's not automatically set
//     });
//     res.status(200).json({fileURL, success: true});
//     } catch(error) {
//         res.status(500).json({fileURL:'', success: false, error: error})
//         console.log(error);
//     }
// }

exports.addExpense = async (req, res, next) => {
    try {
        const { amount, description, category } = req.body;

        if (!amount || !description || !category) {
            return res.status(400).json({ error: 'Bad Parameters' });
        }

        const t = await sequelize.transaction();

        try {
            const newExpense = await req.user.createExpense({
                amount,
                description,
                category,
            }, { transaction: t });

            const totalExpense = Number(req.user.totalExpense) + Number(amount);
            await req.user.update({ totalExpense: totalExpense }, { transaction: t });
            await t.commit();

            res.status(200).json({ newExpense });
        } catch (error) {
            await t.rollback();
            throw error; // Re-throw the error to handle it in the catch block below
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.getExpense =  async (req, res, next) => {
    try {
        const pagesize = +req.query.pagesize;
        const page = +req.query.page || 1;
       // const itemsPerPage = 10;

        const count = await Expense.count({where: {userId: req.user.id}});
        const offset = (page-1) * pagesize;
        const expenses = await Expense.findAll({
            where : {userId: req.user.id},
            offset: offset,
            limit: pagesize,
        });
        res.status(200).json({
            expenses,
            currentPage: page,
            hasNextPage:  pagesize * page < count,
            nextPage: page + 1,
            hasPreviousPage: page > 1,
            previousPage : page - 1,
            lastPage: Math.ceil(count/pagesize),
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({error});
    }
}

exports.deleteExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const deleteId = req.params.id;
    
        if(!deleteId){
            res.status(404).json({message: 'Expesne Not Found'})
        }

        const expenseToDelete = await Expense.findOne({where : {id:deleteId, userId: req.user.id}});
        const amount = expenseToDelete.amount;

        await Expense.destroy({where : {id: deleteId, userId: req.user.id}}, {transaction:t});

        const totalExpense = Number(req.user.totalExpense) - Number(amount);
        await req.user.update({ totalExpense: totalExpense },{transaction:t});
        await t.commit();

        res.status(200).json({messege: 'expense deleted successfully'});
    }
    catch (error) {
        t.rollback();
        res.status(500).json({error});
    }
}
