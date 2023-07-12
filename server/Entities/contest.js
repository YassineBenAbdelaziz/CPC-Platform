const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const contest = sequelize.define('contest',
        {
            id_contest: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
                validate : {
                    notEmpty : {
                        msg : "Title can't be empty.",
                    }
                }
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                validate : {
                    isIn : {
                        args : [['unpublished','upcoming','closed','private']],
                        msg : "Status must be in ['unpublished','upcoming','closed','private']",
                    },
                }
            },
            date: {
                type: DataTypes.DATEONLY,
            },
            start: {
                type: DataTypes.TIME,
            },
            end: {
                type: DataTypes.TIME,
            },
        },
        {
            validate : {
                startTimeSup() {
                    if (this.start >= this.end) {
                        throw new Error("Start time great or equal to end time.")
                    }
                }
            }
        }
    );
    


};