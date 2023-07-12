require('dotenv').config();

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: 'localhost',
    dialect: 'postgres',
  });


const modelDefiners = [
  require('./Entities/problem'),
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}

// We execute any extra setup after the models are defined, such as adding associations.

//sync 
sequelize.sync().then((data) => {
  console.log("Data Successfully Sync.");
})
  .catch((err) => {
    console.log("Error Syncing Tables", err);
  });

// We export the sequelize connection instance to be used around our app.
module.exports = sequelize;