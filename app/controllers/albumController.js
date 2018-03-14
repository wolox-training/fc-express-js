const axios = require('axios'),
  Album = require('../models').Album,
  errors = require('../errors'),
  logger = require('../logger'),
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

exports.buyAlbum = (req, res, next) => {
  const albumId = req.params.id;
  const user = req.userAuthenticated.dataValues;
  albumService
    .getOneAlbum(albumId)
    .then(albumProvider => {
      if (!albumProvider) {
        return next(errors.noAlbum);
      }
      albumService.getAlbum(user.id, albumId).then(existingPurchase => {
        if (!existingPurchase) {
          albumService.create(user.id, albumProvider.title, albumProvider.id).then(albumCreated => {
            logger.info(
              `The user ${user.email} buys the album: ${albumCreated.title} with id: ${albumCreated.id} `
            );
            res.status(200).send(albumCreated);
          });
        } else {
          logger.error(
            `The user ${user.email} has already bought the book ${albumProvider.title} before with id: ${
              albumProvider.id
            } `
          );
          return next(errors.alreadyBought);
        }
      });
    })
    .catch(error => {
      return next(error);
    });
};
