'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('Users', 'validToken', Sequelize.INTEGER);
  },
  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('Users', 'validToken');
  }
};
