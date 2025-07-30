const { Sequelize } = require('sequelize');


const sequelize = new Sequelize("dbusers", 'root', '1994', {
    dialect: 'mysql',
    dialectModule: require('mysql2'),
    host: 'localhost',
    //  logging: false
});


module.exports = sequelize;