const Sequelize = require('sequelize');

// Local Database Creds As of now
// Free service, Only 5 MB Size limit of the database

// Server: sql12.freemysqlhosting.net
// Name: sql12624470
// Username: sql12624470
// Password: tvNpLWk9sp
// Port number: 3306

// console.log(process.env)

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.USER, process.env.PASSWORD, {
  host: process.env.HOST,
  dialect: 'mysql',
  port:process.env.PORT,
  logging: false,
});

module.exports = sequelize;
