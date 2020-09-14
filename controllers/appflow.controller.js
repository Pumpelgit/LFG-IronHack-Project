const mongoose = require("mongoose")
const User = require("../models/user.model")
const Game = require("../models/games.model")
const nodemailer = require("../config/mailer.config")
const passport = require("passport")

module.exports.filter = (req, res, next) => {
  User.findById(req.currentUser._id)
    .populate({
      path: "matchedUsers",
      populate: {
        path: "games",
        model: "Game",
      },
    })
    .then((user) => {
      if (user.activation.profileFinished) {
        Game.find({}, { name: 1, _id: 0 }).then((games) => {
          const genderEnums = [...User.schema.path("gender").enumValues]
          const regionEnums = User.schema.path("region").enumValues
          const langEnums = User.schema.path("language").caster.enumValues
          genderEnums.push("Any")
          const context = {
            user,
            genderEnums,
            regionEnums,
            langEnums,
            games,
          }
          if (req.query.error) {
            context.error = req.query.error
          }
          res.render("appflow/filter", context)
        })
      } else {
        res.redirect("/profile")
      }
    })
    .catch(next)
}

module.exports.lookup = (req, res, next) => {
  if (
    req.body.region == undefined ||
    req.body.gender == undefined ||
    req.body.langSelectedForm == undefined ||
    req.body.gamesSelectedForm == undefined
  ) {
    res.redirect(`/lfg/?error=All fields required`)
  } else {
    const preferences = {
      region: req.body.region,
    }
    if (req.body.gender !== "Any") {
      preferences.gender = req.body.gender
    }

    Game.find({ name: req.body.gamesSelectedForm }, { _id: 1 })
      .then((gamesFound) => {
        const arrayTest = gamesFound.map((game) => {
          return `${game._id}`
        })

        if (req.body.customGameSwitch === "on") {
          preferences.games = arrayTest
        } else {
          preferences.games = { $in: arrayTest }
        }

        if (req.body.customLangSwitch === "on") {
          preferences.language = req.body.langSelectedForm
        } else {
          preferences.language = { $in: req.body.langSelectedForm }
        }
        console.log(preferences)

        User.find(preferences)
          .populate("games")
          .limit(10)
          .then((users) => {
            console.log(`Found ${users.length} entries`)
            User.findById(req.currentUser.id)
              .populate("matchedUsers")
              .populate("games")
              .then((user) => {
                console.log(user)
                res.render("appflow/swipe", { users, user })
              })
              .catch(next)
          })
          .catch(next)
      })
      .catch(next)
  }
}
