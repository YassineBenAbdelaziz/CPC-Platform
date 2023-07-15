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
                type: DataTypes.STRING(2000),
                allowNull: false,
            },
            input: {
                type: DataTypes.STRING(1000),
                allowNull: false,
            },
            output: {
                type: DataTypes.STRING(1000),
                allowNull: false,
            },
            note: {
                type: DataTypes.STRING(1000),
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
                type: DataTypes.STRING,
                allowNull: true,
            },
            solution_file: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }
    );

};