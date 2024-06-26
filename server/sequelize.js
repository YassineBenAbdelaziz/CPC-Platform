require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
  });

const entitiesDefiners = [
  require('./Entities/contest'),
  require('./Entities/problem'),
  require('./Entities/example'),
  require('./Entities/submission'),
  require('./Entities/tag'),
  require('./Entities/user'),
  require('./Entities/role'),
];

// We define all models according to their files.
for (const entityDefiner of entitiesDefiners) {
  entityDefiner(sequelize);
}

// We execute any extra setup after the models are defined, such as adding associations.
sequelize.models.problem.hasMany(sequelize.models.example);
sequelize.models.example.belongsTo(sequelize.models.problem, {
  allowNull: false,
  onDelete: "cascade"
});

sequelize.models.contest.hasMany(sequelize.models.problem);
sequelize.models.problem.belongsTo(sequelize.models.contest, {
  foreignKey: "id_contest",
  onDelete: "cascade"
});

sequelize.models.user.hasMany(sequelize.models.submission);
sequelize.models.submission.belongsTo(sequelize.models.user, {
  allowNull: false
});

sequelize.models.problem.hasMany(sequelize.models.submission);
sequelize.models.submission.belongsTo(sequelize.models.problem, {
  allowNull: false
});

const user_problem = sequelize.define('user_problem', {
  status: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

sequelize.models.problem.belongsToMany(sequelize.models.user, { foreignKey: "id_problem", through: "user_problem" });
sequelize.models.user.belongsToMany(sequelize.models.problem, { foreignKey: "id_user", through: "user_problem" });

sequelize.models.problem.belongsToMany(sequelize.models.tag, { foreignKey: "id_problem", through: "problem_tag" });
sequelize.models.tag.belongsToMany(sequelize.models.problem, { foreignKey: "id_tag", through: "problem_tag" });

sequelize.models.user.belongsToMany(sequelize.models.contest, { foreignKey: "id_user", through: "participate" });
sequelize.models.contest.belongsToMany(sequelize.models.user, { foreignKey: "id_contest", through: "participate" });

const user_lang = sequelize.define('user_lang', {
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  id_problem: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  lang: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  count: {
    type: DataTypes.INTEGER
  }
});

const user_skill = sequelize.define('user_skill', {
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  skill: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  count: {
    type: DataTypes.INTEGER
  }
});

sequelize.models.role.hasMany(sequelize.models.user, { 
  foreignKey: {
    name : 'id_role',
    allowNull: false,
    defaultValue : 1,
  }
});

sequelize.models.user.belongsTo(sequelize.models.role, { 
  foreignKey: {
    name : 'id_role',
    allowNull: false,
    defaultValue : 1,
  }
});

 
sequelize.models.problem.belongsTo(sequelize.models.user,{ targetKey: 'username', foreignKey: 'owner' });

//sync 
sequelize.sync().then((data) => {
  console.log("Data Successfully Sync.");
})
  .catch((err) => {
    console.log("Error Syncing Tables", err);
  });


// We export the sequelize connection instance to be used around our app.
module.exports = sequelize;