const express = require("express")
const router = express.Router()
const multer = require("multer")
const sessionMiddleware = require("../middlewares/session.middleware")
const uploads = multer({ dest: "./public/uploads" })
const userController = require("../controllers/user.controller")

router.get("/login", sessionMiddleware.isNotAuthenticated, userController.login)
router.get("/signup", sessionMiddleware.isNotAuthenticated, userController.signup)
router.get("/auth/google", sessionMiddleware.isNotAuthenticated,userController.doSocialLoginGoogle)
router.post("/login", sessionMiddleware.isNotAuthenticated,userController.doLogin)
router.get("/preferences",sessionMiddleware.isAuthenticated,userController.preferences)

router.get("/", (req, res, next) => {
  res.redirect("preferences")
})

module.exports = router
