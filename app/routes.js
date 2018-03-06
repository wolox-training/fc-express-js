const users = require('./controllers/usersController'),
  auth = require('./middlewares/auth');

exports.init = app => {
  app.post('/users', [], users.create);
  app.post('/users/session', [], users.login);
  app.get('/users', [auth.secure], users.getAllUsers);
};
