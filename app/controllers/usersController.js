'use strict';

const errors = require('../errors'),
  logger = require('../logger'),
  User = require('../models').User,
  bcrypt = require('bcrypt'),
  moment = require('moment'),
  userService = require('../services/userService'),
  tokenExpirationTime = require('./../../config').common.session.tokenExpiration,
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
          const payload = {
            email: userInBD.email,
            numberOfValidToken: userInBD.validToken,
            expirationTime: moment()
              .add(tokenExpirationTime, 'minutes')
              .unix()
          };
          const auth = sessionManager.encode(payload);
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
  const randomNumber = Math.floor(Math.random() * 1000);
  const userParams = req.body
    ? {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password,
        validToken: randomNumber
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
  const paginationParams = req.query
    ? {
        limit: req.query.limit,
        offset: req.query.offset
      }
    : {};

  User.findAll({
    attributes: ['name', 'surname', 'email'],
    limit: paginationParams.limit || 10,
    offset: paginationParams.offset || 0
  })
    .then(users => {
      res.status(200);
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

exports.createUserAdmin = (req, res, next) => {
  const randomNumber = Math.floor(Math.random() * 1000);
  const isAdmin = req.userAuthenticated.dataValues.isAdmin;
  const userParams = req.body
    ? {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password,
        validToken: randomNumber
      }
    : {};
  if (!isAdmin) {
    next(errors.isNotAdmin);
  } else {
    userService
      .createUserAdmin(userParams)
      .then(user => {
        logger.info(`The admin ${user.name} ${user.surname} was created succesfully`);
        res.status(201).send({
          name: user.name,
          surname: user.surname,
          email: user.email,
          isAdmin: user.isAdmin
        });
      })
      .catch(err => {
        logger.error('the admin User was not created');
        res.status(422).send(err.message);
        next(err);
      });
  }
};

exports.invalidateSession = (req, res, next) => {
  const email = req.userAuthenticated.dataValues.email;
  userService
    .invalidateSessionForUser(email)
    .then(userInvalidated => {
      logger.error('Your token was invalidated');
      res.status(200).send('Your token was invalidated');
    })
    .catch(err => {
      logger.error('can not invalidate token of session');
      res.status(422).send(err.message);
    });
};
