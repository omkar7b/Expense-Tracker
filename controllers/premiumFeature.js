const User = require('../models/users');
const Expense = require('../models/expense');
const sequelize = require('../util/database');

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