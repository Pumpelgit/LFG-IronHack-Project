const passport = require("passport")
const User = require("../models/user.model")
const GoogleStrategy = require("passport-google-oauth20").Strategy

const google = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://lfg-ironhack.herokuapp.com/auth/google",
  },
  (accessToken, refreshToken, profile, next) => {
    User.findOne({ "social.google": profile.id })
      .then((user) => {
        if (user) {
          next(null, user)
        } else {
          const newUser = new User({
            name: profile._json.name,
            username: profile.displayName,
            email: profile._json.email,
            avatar: profile._json.picture,
            password:
              profile.provider + Math.random().toString(36).substring(7),
            social: {
              google: profile.id,
            },
          })

          newUser
            .save()
            .then((user) => {
              console.log(user)
              next(null, user)
            })
            .catch((err) => next(err))
        }
      })
      .catch((err) => next(err))
  }
)

passport.use(google)

module.exports = passport.initialize()
