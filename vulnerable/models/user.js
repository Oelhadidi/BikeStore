const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/database");
const bcrypt = require("bcryptjs");

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user'
    }
}, {
    timestamps: true
});

// Hash password before saving user
// User.beforeCreate(async (user) => {
//     const hashedPassword = await bcrypt.hash(user.password, 10);
//     user.password = hashedPassword;
// });

module.exports = User;
