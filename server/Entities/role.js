const { Sequelize, DataTypes } = require('sequelize');


module.exports = (sequelize) => {
    sequelize.define('role',
        {
            id_role: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            description : {
                type: DataTypes.STRING,
                allowNull : false,
                unique: true,
            }
        }
    )
};