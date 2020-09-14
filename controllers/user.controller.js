const mongoose = require("mongoose")
const User = require("../models/user.model")
const nodemailer = require("../config/mailer.config")
const passport = require("passport")
const Game = require("../models/games.model")

module.exports.doSocialLoginGoogle = (req, res, next) => {
  const passportController = passport.authenticate(
    "google",
    { scope: ["profile", "email"] },
    (error, user) => {
      if (error) {
        next(error)
      } else {
        req.session.userId = user._id
        console.log("tafak")
        if (user.activation.profileFinished) {
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
  const renderMenuFalse = {}
  res.render("user/login", { renderMenuFalse })
}

module.exports.doLogin = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        user.checkPassword(req.body.password).then((match) => {
          if (match) {
            if (user.activation.active) {
              req.session.userId = user._id
              if (user.activation.profileFinished) {
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
    .populate("games")
    .then((user) => {
      console.log(user)
      const genderEnums = User.schema.path("gender").enumValues
      const regionEnums = User.schema.path("region").enumValues
      const langEnums = User.schema.path("language").caster.enumValues
      const renderMenuFalse = {}
      Game.find({}).then((games) => {
        res.render("user/profile", {
          user,
          genderEnums,
          langEnums,
          regionEnums,
          games,
          renderMenuFalse,
        })
      })
    })
    .catch(next)
}

module.exports.updateProfile = (req, res, next) => {
  let documentChange = req.body
  // console.log("UPDATE PROFILE")
  // console.log(documentChange)

  if (documentChange.games) {
    Game.find({ name: documentChange.games })
      .then((gamesFound) => {
        documentChange.games = gamesFound
        console.log(gamesFound)
        User.findOneAndUpdate({ _id: req.currentUser._id }, documentChange, {
          new: "true",
        })
          .populate("games")
          .then((user) => {
            console.log(user)
            user.requiredSettingsFinished()
            res.json({ user })
            //res.re("user/profile", {user})
          })
          .catch(next)
      })
      .catch(next)
  } else {
    if (documentChange.gameTags) {
      const parsedTag = JSON.parse(documentChange.gameTags)
      documentChange = `{"gameTags.${Object.keys(parsedTag)[0]}": "${
        parsedTag[Object.keys(parsedTag)[0]]
      }"}`
      documentChange = JSON.parse(documentChange)
    }
    if (req.file) {
      documentChange.avatar = `/uploads/${req.file.filename}`
    }

    User.findOneAndUpdate({ _id: req.currentUser._id }, documentChange, {
      new: "true",
    })
      .then((user) => {
        user.requiredSettingsFinished()
        res.json({ user })
        //res.re("user/profile", {user})
      })
      .catch(next)
  }
}

module.exports.landing = (req, res, next) => {
  const renderMenuFalse = {}
  res.render("appflow/landing", { renderMenuFalse })
}

module.exports.likeUser = (req, res, next) => {
  const likedUserId = mongoose.Types.ObjectId(req.params.id)
  console.log(likedUserId);
  User.findById(req.currentUser.id)
    .then((currentUser) => {
      if (currentUser.likedUsers.includes(likedUserId)) {
        console.log("already liked user")
        res.json({ petition: "DUPLICATE" })
      } else {
        console.log("Not Liked Checking if Match")
        User.findById(likedUserId).then((likedUser) => {
          console.log(likedUser)
          if (likedUser.likedUsers.includes(req.currentUser.id)) {
            console.log("MATCH")
            const promiseLikedUser = new Promise((resolve,rej) => {
              likedUser.matchedUsers.push(currentUser._id)
              console.log(likedUser);
              likedUser.save()
              .then(resolve)
            })
            const promiseCurrentUser = new Promise((resolve,rej) => {
              currentUser.matchedUsers.push(likedUser._id)
              console.log(currentUser);
              currentUser.save()
              .then(resolve)
            })
            Promise.all([promiseLikedUser,promiseCurrentUser])
            .then(()=>{
              console.log("Players MATCHED")
              res.json({ likedUser, petition: "MATCH" })
            })
          } else {
            console.log("No Match adding to likedUsers")
            currentUser.likedUsers.push(likedUserId)
            currentUser.save()
            .then((user) => {
              console.log("liked user added successfully")
              res.json({ petition: "USER LIKED" })
            })
          }
        })
      }
    })
    .catch(next)
}

module.exports.logout = (req, res, next) => {
  req.session.destroy()
  res.redirect("/")
}
