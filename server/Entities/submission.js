const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const submission = sequelize.define('submission',
        {
            id_submission: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            tokens: {
                type: DataTypes.STRING(3000),
                allowNull: false,
            },
            lang: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            code: {
                type: DataTypes.STRING(5000),
                allowNull: false,
            },
            time: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            memory: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            result: {
                type: DataTypes.STRING(2000),
                allowNull: false,
            },
        }
    );
};