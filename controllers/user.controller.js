const mongoose = require("mongoose")
const User = require("../models/user.model")
const nodemailer = require("../config/mailer.config")
const passport = require("passport")

module.exports.doSocialLoginGoogle = (req, res, next) => {
  console.log("doing social loging")
  const passportController = passport.authenticate(
    "google",
    { scope: ["profile", "email"] },
    (error, user) => {
      if (error) {
        next(error)
      } else {
        req.session.userId = user._id
        res.redirect("/")
      }
    }
  )

  passportController(req, res, next)
}

module.exports.doSocialLoginGoogle = (req, res, next) => {
  const passportController = passport.authenticate(
    "google",
    { scope: ["profile", "email"] },
    (error, user) => {
      if (error) {
        next(error)
      } else {
        req.session.userId = user._id
        if(user.activation.profileFinished){
          res.redirect("/lfg")
        } else {
          res.redirect("/profile")
        }
      }
    }
  )

  passportController(req, res, next)
}

module.exports.login = (req, res, next) => {
  res.render("user/login")
}

module.exports.doLogin = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        user.checkPassword(req.body.password).then((match) => {
          if (match) {
            if (user.activation.active) {
              req.session.userId = user._id
              if(user.activation.profileFinished){
                res.redirect("/lfg")
              } else {
                res.redirect("/profile")
              }
            } else {
              console.log("password wrong")
              res.render("user/login", {
                error: {
                  validation: {
                    message: "Your account is not active, check your email!",
                  },
                },
              })
            }
          } else {
            console.log("222")
            res.render("user/login"),
              {
                error: {
                  email: {
                    message: "user not found or wrong username/password",
                  },
                },
              }
          }
        })
      } else {
        console.log("333")
        res.render("user/login", {
          error: {
            email: {
              message: "user not found or wrong username/password",
            },
          },
        })
      }
    })
    .catch(next)
}

module.exports.signup = (req, res, next) => {
  res.render("user/signup")
}

module.exports.createUser = (req, res, next) => {
  const userParams = req.body
  const user = new User(userParams)

  user
    .save()
    .then((user) => {
      nodemailer.sendValidationEmail(
        user.email,
        user.activation.token,
        user.name
      )
      res.render("user/login", {
        message: "Check your email for activation",
      })
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.render("user/signup", {
          error: error.errors,
          user,
        })
      } else if (error.code === 11000) {
        res.render("user/signup", {
          user,
          error: {
            email: {
              message: "user already exists",
            },
          },
        })
      } else {
        next(error)
      }
    })
    .catch(next)
}

module.exports.activateUser = (req, res, next) => {
  User.findOne({ "activation.token": req.params.token })
    .then((user) => {
      if (user) {
        user.activation.active = true
        user
          .save()
          .then((user) => {
            res.render("user/login", {
              message: "Your account has been activated, log in below!",
            })
          })
          .catch((e) => next)
      } else {
        res.render("user/login", {
          error: {
            validation: {
              message: "Invalid link",
            },
          },
        })
      }
    })
    .catch((e) => next)
}

module.exports.profile = (req, res, next) => {
  User.findById(req.currentUser._id)
    .then((user) => {
      const genderEnums = User.schema.path('gender').enumValues
      console.log(genderEnums);
      res.render("user/profile", { user,genderEnums })
    })
    .catch(next)
}

module.exports.updateProfile = (req, res, next) => {
  
  const documentChange = req.body
  if (req.file) {
    documentChange.avatar = `/uploads/${req.file.filename}`
  }

  console.log(documentChange);

  User.findByIdAndUpdate(req.currentUser._id, documentChange, { new: "true" })
    .then((user) => {
      user.requiredSettingsFinished()
      res.json({user})
      //res.re("user/profile", {user})
    })
    .catch(next)
}

module.exports.landing = (req, res, next) => {
  res.render("appflow/landing")
}

module.exports.logout = (req, res, next) => {
  req.session.destroy()
  res.redirect("/")
}
