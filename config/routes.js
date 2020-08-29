const express = require("express")
const router = express.Router()
const multer = require("multer")
const sessionMiddleware = require("../middlewares/session.middleware")
const uploads = multer({ dest: "./public/uploads" })
const userController = require("../controllers/users.controller")

router.get("/login",userController.login)
router.get("/signup", userController.signup)

router.get("/", (req, res, next) => {
  res.render("appflow/landing")
})

module.exports = router
