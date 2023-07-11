const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

module.exports = (sequelize) => {
    const contest = sequelize.define('Contest',
        {
            id_contest: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false
            },
            date: {
                type: DataTypes.DATE,
            },
            start: {
                type: DataTypes.DATE,
            },
            end: {
                type: DataTypes.DATE,
            },
        }
    );
    


};