const express = require('express');
const router = express.Router();
const multer = require('multer');
const tweetsController = require('../controllers/tweets.controller')
const usersController = require('../controllers/users.controller')
const sessionMiddleware = require('../middlewares/session.middleware')
const uploads = multer({ dest: './public/uploads' });


router.get("/", (req, res) => {
    res.redirect("/home");
  });