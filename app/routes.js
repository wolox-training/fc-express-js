const users = require('./controllers/usersController');

exports.init = app => {
  app.post('/users', [], users.create);
};
