'use strict';

module.exports = function(sequelize, DataTypes) {
  const Album = sequelize.define(
    'Album',
    {
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'User',
          key: 'id'
        }
      },
      title: DataTypes.STRING,
      albumId: DataTypes.INTEGER
    },
    {
      classMethods: {
        associate(models) {
          // associations can be defined here
        }
      }
    }
  );
  return Album;
};
