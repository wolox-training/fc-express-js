const User = require('../models').User,
  logger = require('../logger'),
  errors = require('../errors');

const getOne = email => {
  return User.findOne({ where: email }).catch(err => {
    logger.error(err.message);
    throw errors.databaseError(err.detail);
  });
};

exports.getByEmail = email => {
  return getOne({ email });
};

exports.createUserAdmin = user => {
  const randomNumber = Math.floor(Math.random() * 1000);
  console.log(randomNumber);
  return User.findOrCreate({
    where: { email: user.email },
    defaults: {
      name: user.name,
      surname: user.surname,
      password: user.password,
      isAdmin: true,
      validToken: randomNumber
    }
  })
    .then(([admin, isNewUser]) => {
      if (!isNewUser) {
        return admin.update({ isAdmin: true });
      }
      return admin;
    })
    .catch(err => {
      throw errors.databaseError;
    });
};

exports.invalidateSessionForUser = email => {
  return User.findOne({ where: { email } })
    .then(user => {
      const invalidToken = Math.floor(Math.random() * (user.validToken - 1000)) + 1000;
      return user.update({ validToken: invalidToken });
    })
    .catch(err => {
      logger.error(err.message);
      throw errors.databaseError;
    });
};
