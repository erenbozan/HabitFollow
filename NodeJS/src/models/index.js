const { Sequelize } = require('sequelize');
const config = require('../config/database').development;

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        port: config.port,
        dialect: config.dialect
    }
);

const db = {
    sequelize,
    Sequelize
};

// Import models
db.User = require('./user.model')(sequelize, Sequelize);
db.Habit = require('./habit.model')(sequelize, Sequelize);

// Associations
db.User.hasMany(db.Habit, { foreignKey: 'user_id' });
db.Habit.belongsTo(db.User, { foreignKey: 'user_id' });

module.exports = db; 