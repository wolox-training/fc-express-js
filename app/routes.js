const users = require('./controllers/usersController');

exports.init = app => {
  app.post('/users', [], users.create);
  app.post('/users/session', [], users.login);
};
