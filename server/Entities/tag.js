const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const tag = sequelize.define('tag',
        {
            id_tag: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            tag: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        }
    );

};