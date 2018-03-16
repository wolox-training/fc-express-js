'use strict';

const errors = require('../errors'),
  logger = require('../logger'),
  User = require('../models').User,
  bcrypt = require('bcrypt'),
  userService = require('../services/userService'),
  sessionManager = require('../services/sessionManager');

exports.login = (req, res, next) => {
  const userLogin = req.body
    ? {
        email: req.body.email,
        password: req.body.password
      }
    : {};

  userService.getByEmail(userLogin.email).then(userInBD => {
    if (userInBD) {
      bcrypt.compare(userLogin.password, userInBD.password).then(isValid => {
        if (isValid) {
          const auth = sessionManager.encode({ email: userInBD.email });
          res.status(200);
          res.set(sessionManager.HEADER_NAME, auth);
          logger.info(`The user ${userInBD.email} was logged in succesfull`);
          res.send(userInBD);
        } else {
          next(errors.invalidPassword);
        }
      });
    } else {
      next(errors.invalidCredentials);
    }
  });
};

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
    })
    .catch(err => {
      if (err.errors) {
        logger.error(err.message);
        res.status(422).send(err.message);
      } else {
        logger.error(errors.databaseError);
        res.status(400).send(errors.databaseError);
      }
    });
};

exports.getAllUsers = (req, res, next) => {
  User.findAll({
    attributes: ['name', 'surname', 'email']
  })
    .then(users => {
      res.status(201);
      res.send({ users });
    })
    .catch(err => {
      if (err.errors) {
        next(err);
      } else {
        logger.error(errors.databaseError(err.detail));
        res.status(400).send(errors.databaseError(err));
      }
    });
};
