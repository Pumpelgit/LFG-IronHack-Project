const User = require('../models/user.model')

module.exports.isAuthenticated = (req, res, next) => {
  User.findById(req.session.userId)
    .then(user => {
      if (user) {
        req.currentUser = user
        res.locals.currentUser = user

        next()
      } else {
        res.redirect('/login')//if not authenticated we send him to login screen
      }
    })
    .catch(next);
}

module.exports.isNotAuthenticated = (req, res, next) => {
  User.findById(req.session.userId)
    .then((user) => {
      if (user) {
        res.redirect("/");//end point where we send user if he is authenticated
      } else {
        next();//we pass on the petition in the pipe, eventually reaching "landing page"
      }
    })
    .catch(next);
};