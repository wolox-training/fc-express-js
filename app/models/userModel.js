module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define(
    'User',
    {
      id: DataTypes.INT,
      name: DataTypes.STRING,
      surname: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING
    },
    {
      classMethods: {
        associate(models) {
          // associations can be defined here
        }
      }
    }
  );
  return User;
};
