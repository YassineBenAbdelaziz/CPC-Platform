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

const entitiesDefiners = [
  require('./Entities/contest'),
  require('./Entities/problem'),
  require('./Entities/example'),
  require('./Entities/submission'),
  require('./Entities/tag'),
  require('./Entities/user',)
];

// We define all models according to their files.
for (const entityDefiner of entitiesDefiners) {
  entityDefiner(sequelize);
}

// We execute any extra setup after the models are defined, such as adding associations.
sequelize.models.problem.hasMany(sequelize.models.example);
sequelize.models.example.belongsTo(sequelize.models.problem, {
  foreignKey: "id_problem",
  allowNull: false
});

sequelize.models.contest.hasMany(sequelize.models.problem);
sequelize.models.problem.belongsTo(sequelize.models.contest, {
  foreignKey: "id_contest"
});

sequelize.models.user.hasMany(sequelize.models.submission);
sequelize.models.submission.belongsTo(sequelize.models.user, {
  foreignKey: "id_user",
  allowNull: false
});

sequelize.models.problem.belongsToMany(sequelize.models.tag, { foreignKey: "id_problem", through: "problem_tag" });
sequelize.models.tag.belongsToMany(sequelize.models.problem, { foreignKey: "id_tag", through: "problem_tag" });

sequelize.models.user.belongsToMany(sequelize.models.contest, { foreignKey: "id_user", through: "participate" });
sequelize.models.contest.belongsToMany(sequelize.models.user, { foreignKey: "id_contest", through: "participate" });

//sync 
sequelize.sync().then((data) => {
  console.log("Data Successfully Sync.");
})
  .catch((err) => {
    console.log("Error Syncing Tables", err);
  });


// We export the sequelize connection instance to be used around our app.
module.exports = sequelize;