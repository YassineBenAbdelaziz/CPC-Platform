require('dotenv').config();

const app = require('./app');
const sequelize = require('./sequelize');



sequelize.authenticate().then( ( ) => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  });


const port = process.env.Server_PORT ;

app.listen(port, () => console.log(`Server running on port ${port}`));