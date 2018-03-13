const users = require('./controllers/usersController'),
  auth = require('./middlewares/auth'),
  albums = require('./controllers/albumController');

exports.init = app => {
  app.post('/users', [], users.create);
  app.post('/users/session', [], users.login);
  app.get('/users', [auth.secure], users.getAllUsers);
  app.get('/albums', [auth.secure], albums.getAllAlbums);
  app.post('/albums/:id', [auth.secure], albums.buyAlbum);
  app.get('/users/:user_id/albums', [auth.secure], users.getBoughtAlbums);
};
