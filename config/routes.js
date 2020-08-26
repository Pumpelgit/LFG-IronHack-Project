const express = require("express")
const router = express.Router()
const multer = require("multer")
const sessionMiddleware = require("../middlewares/session.middleware")
const uploads = multer({ dest: "./public/uploads" })

router.get("/login", (req, res, next) => {
  res.render("user/login")
})
router.get("/signup", (req, res, next) => {
  res.render("user/signup")
})

router.get("/", (req, res, next) => {
  res.render("appflow/landing")
})

module.exports = router
