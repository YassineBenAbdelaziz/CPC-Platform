const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const problem = sequelize.define('problem',
        {
            id_problem: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            topic: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            input: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            output: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            note: {
                type: DataTypes.STRING(2000),
                allowNull: true,
            },
            score: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            time_limit: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            memory_limit: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            test_file: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            solution: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            tutorial: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            checker: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }
    );

};