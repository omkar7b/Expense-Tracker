const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const DownloadedFiles = sequelize.define('downloadedfiles', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    fileURL: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    userId: Sequelize.INTEGER,
    date : Sequelize.DATEONLY
})

module.exports = DownloadedFiles;