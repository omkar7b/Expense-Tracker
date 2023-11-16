const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    name: {
        type: Sequelize.STRING,
        allowNUll : false
    },
    email: {
        type: Sequelize.STRING,
        allowNull : false,
        unique : true
    },
    password: {
        type: Sequelize.STRING,
        allowNull : false
    },
    ispremiumuser : {
        type: Sequelize.BOOLEAN
    },
    totalExpense: {
        type: Sequelize.DECIMAL,
        defaultValue: 0
    }
})

module.exports = User;