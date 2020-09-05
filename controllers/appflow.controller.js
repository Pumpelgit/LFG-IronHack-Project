const mongoose = require("mongoose")
const User = require("../models/user.model")
const nodemailer = require("../config/mailer.config")
const passport = require("passport")

module.exports.filter = (req, res, next) => {
  User.findById(req.currentUser._id)
    .then((user) => {
      if(user.activation.finishedProfile){
        console.log("profile finished");
        res.render("appflow/filter")
      } else {
        console.log("profile not finished redirecting");
        res.redirect("/profile")
      }
    })
    .catch(next)
  }