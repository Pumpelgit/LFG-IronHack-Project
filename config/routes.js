const express = require("express")
const router = express.Router()
const multer = require("multer")
const sessionMiddleware = require("../middlewares/session.middleware")
const uploads = multer({ dest: "./public/uploads" })
const userController = require("../controllers/user.controller")
const appflowController = require("../controllers/appflow.controller")
const { session } = require("passport")

router.get("/landing",sessionMiddleware.isNotAuthenticated,userController.landing)
router.get("/login", sessionMiddleware.isNotAuthenticated, userController.login)
router.get("/signup", sessionMiddleware.isNotAuthenticated, userController.signup)
router.get("/auth/google", sessionMiddleware.isNotAuthenticated,userController.doSocialLoginGoogle)
router.post("/login", sessionMiddleware.isNotAuthenticated,userController.doLogin)
router.get("/profile",sessionMiddleware.isAuthenticated,userController.profile)
router.post("/update/:field/", sessionMiddleware.isAuthenticated,uploads.single('avatar'),userController.updateProfile)
router.get("/lfg",sessionMiddleware.isAuthenticated,appflowController.filter)
router.get("/", (req, res, next) => {  
  res.redirect("/lfg")
})

module.exports = router
