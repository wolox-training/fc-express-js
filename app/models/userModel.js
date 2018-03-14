const errors = require('../errors'),
  bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define(
    'User',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false, // won't allow null
        notEmpty: true
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
        isEmail: true,
        unique: true,
        validate: {
          emailFormat(value) {
            if (!value.endsWith('@wolox.com.ar')) {
              throw errors.invalidEmail;
            }
          }
        }
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        isAlphanumeric: true, // will only allow alphanumeric characters, so "_abc" will fail
        notEmpty: true,
        validate: {
          len: {
            args: [8, 255], // only allow values with length between 8 and 20
            msg: 'Password values with length between 8 and 255'
          }
        }
      }
    },
    {
      classMethods: {
        associate(models) {
          User.hasMany(models.Album, { as: 'albums', foreignKey: 'userId' });
        }
      },
      hooks: {
        afterValidate: (user, options) => {
          user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null);
        }
      }
    }
  );
  return User;
};
