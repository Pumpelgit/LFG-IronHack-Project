const bcrypt = require("bcrypt")
const mongoose = require("mongoose")

const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

const generateRandomToken = () => {
  const characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let token = ""
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)]
  }
  return token
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minLength: [3, "Name needs at least 3 characters"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is require"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [EMAIL_PATTERN, " Email is invalid"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    minlength: [8, "Password must be at least 8 characters long"],
  },
  pictures: {
    type: [String],
  },
  description: {
    type: String,
    maxlength: 240,
  },
  activation: {
    active: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: generateRandomToken,
    },
    profileFinished: {
      type: String,
      default: false,
    },
  },
  social: {
    google: String,
  },
  userRating: {
    gg: {
      type:Number,
    },
    helpful:{
      type: Number,
    }
  },
  birthdate: Date,
  gender: {
    type: String,
    enum: ["Female","Male","Other"]
  },
  region: {
    type: String,
    enum: ["North America", "South America","Europe","Asia","Australia","Africa"]
  },
  language: {
    type: [String],
    enum: ["DE","EN","ES","FR","HR","IT","JA","NL","PL","PT","RU","ZH"]
  },
  playerTags: {
    discord: String,
    steam: String,
    battlenet: String,
    epic: String,
    uplay: String,
    origin: String,
    riot: String,
    other: String
  }
})

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.hash(this.password, 10).then((hash) => {
      this.password = hash
      next()
    })
  } else {
    next()
  }
})

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password)
}

const User = mongoose.model("User", userSchema)

module.exports = User
