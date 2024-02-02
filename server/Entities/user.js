const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
    sequelize.define('user',
        {
            id_user: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                validate: {
                    isEmail: true,
                }
            },
            username: {
                type: DataTypes.STRING(30),
                allowNull: false,
                unique: true,
                validate: {
                    notEmpty: {
                        msg: "Username can't be empty",
                    }
                }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    // Minimum eight and maximum 10 characters, at least one uppercase letter,
                    // one lowercase letter, one number and one special character:
                    is: {
                        args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i,
                        msg: "Minimum eight and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
                    }

                }
            },
            fname: {
                type: DataTypes.STRING(40),
            },
            lname: {
                type: DataTypes.STRING(40),
            },
            score: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            rank: {
                type: DataTypes.STRING,
                defaultValue: 'Newbie',
                validate: {
                    isIn: [['Newbie', 'Expert', 'Master']]
                }
            },
            imagePath: {
                type: DataTypes.STRING,
                defaultValue: "../uploads/profile.webp"
            }
        },
        {
            validate: {
                userNameMatchPass() {
                    if (this.username === this.password) {
                        throw new Error("Password must be different from username.");
                    }
                }
            },
            hooks: {
                beforeCreate: async (user) => {
                    try {
                        const hashedPassword = await bcrypt
                            .hash(user.password, 10);
                        user.password = hashedPassword;
                    } catch (error) {
                        throw new Error("There was an error while trying to register");
                    }
                },
                beforeUpdate: async (user) => {
                    try {
                        if (user.dataValues.password !==
                            user._previousDataValues.password) {
                            const hashedPassword = await bcrypt
                            .hash(user.password, 10);
                            user.password = hashedPassword;
                        }

                    } catch (error) {
                        throw new Error("There was an error while trying to register");
                    }
                },
            },
        },
    );
};
