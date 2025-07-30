const { DataTypes } = require('sequelize');
const { Sequelize } = require('sequelize');

module.exports = function (sequelize) {
    return sequelize.define('UsersData', {
        id: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING(40),
            unique: true,
            allowNull: false,
        },
        pass: {
            type: DataTypes.STRING(8),
            allowNull: false,
        },
    }, {
        tableName: 'listUsers',
        timestamps: false,

    })
}