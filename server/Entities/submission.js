const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const submission = sequelize.define('submission',
        {
            id_submission: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            lang: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            result: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            code: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            output: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        }
    );
};