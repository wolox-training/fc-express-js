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

  userService.getByEmail(userLogin.email).then(u => {
    if (u) {
      bcrypt.compare(userLogin.password, u.password).then(isValid => {
        if (isValid) {
          const auth = sessionManager.encode({ email: u.email });
          res.status(201);
          res.set(sessionManager.HEADER_NAME, auth);
          logger.info(`The user ${u.email} was logged in succesfull`);
          res.send(u);
        } else {
          next(errors.databaseError);
        }
      });
    } else {
      next(errors.invalidUser);
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
        logger.error(errors.databaseError(err));
        res.status(400).send(errors.databaseError(err));
      }
    });
};

// exports.listUsers = (req,res,next) => {
//     let limit = 50;   // number of records per page
//     let offset = 0;
//     User.findAndCountAll()
//     .then((data) => {
//       User.findAll({
//         attributes: ['name', 'surname', 'email'],
//         limit: limit,
//         offset: offset
//       })
//       .then((users) => {
//         res.status(200).json({'result': users, 'count': data.count});
//       });
//     })
//     .catch(function (error) {
//       res.status(500).send('Internal Server Error');
//     });
//   };
