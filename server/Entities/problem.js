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
                type: DataTypes.STRING,
                allowNull: false,
            },
            input: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            output: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            note: {
                type: DataTypes.STRING,
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
                allowNull: false,
                // validate: {
                //     isIn: {
                //         args: [['hidden', 'visible']],
                //         msg: "Status must be in ['hidden','visible']",
                //     },
                // }
            },
            id_contest: {
                type: DataTypes.INTEGER,
                allowNull: true
            }
        }
    );

};