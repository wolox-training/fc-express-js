const axios = require('axios'),
  albumService = require('../services/albumService');

exports.getAllAlbums = (req, res) => {
  albumService
    .getAllOfAlbumsProvider()
    .then(albums => {
      res.status(200);
      res.send(albums.data);
    })
    .catch(error => {
      throw error;
    });
};
