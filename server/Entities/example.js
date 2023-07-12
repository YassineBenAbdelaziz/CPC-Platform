const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const example = sequelize.define('example',
        {
            id_example: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            input: {
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