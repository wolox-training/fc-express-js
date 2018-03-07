const axios = require('axios'),
  errors = require('../errors');

exports.getAllAlbums = (req, res) => {
  axios
    .get('https://jsonplaceholder.typicode.com/albums')
    .then(response => {
      res.status(200);
      res.send(response.data);
    })
    .catch(error => {
      throw error;
    });
};
