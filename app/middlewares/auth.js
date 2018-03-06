const sessionManager = require('./../services/sessionManager'),
  User = require('../models').User;

exports.secure = (req, res, next) => {
  const auth = req.headers[sessionManager.HEADER_NAME];

  if (auth) {
    const email = sessionManager.decode(auth);
    User.findOne({ where: email }).then(userAuthenticated => {
      if (userAuthenticated) {
        req.email = userAuthenticated;
        next();
      } else {
        res.status(401).end();
      }
    });
  } else {
    res.status(401);
    res.send({ message: 'Your request hasnt authorization header' });
  }
};
