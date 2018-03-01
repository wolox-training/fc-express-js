const users = require('./controllers/usersController');

exports.init = app => {
  // users
  // app.get('/endpoint/get/path', [], controller.methodGET);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  app.post('/users', [], users.create);
};
