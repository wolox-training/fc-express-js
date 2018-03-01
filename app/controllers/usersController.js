'use strict';

const errors = require('../errors'),
  logger = require('../logger'),
  User = require('../models').User;

exports.create = (req, res, next) => {
  const userParams = req.body
    ? {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password
      }
    : {};

  User.create(userParams)
    .then(user => {
      logger.info(`The user ${user.name} ${user.surname} was created succesfully`);
      res.status(201).send({
        name: user.name,
        surname: user.surname,
        email: user.email
      });
      res.end();
    })
    .catch(err => {
      if (err.errors) {
        logger.error(err.message);
        res.status(422).send(err.message);
      } else {
        logger.error(errors.databaseError(err));
        res.status(400).send(errors.databaseError(err));
      }
    });
};
