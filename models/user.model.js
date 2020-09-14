const bcrypt = require("bcrypt")
const mongoose = require("mongoose")

const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

const generateRandomToken = () => {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
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
  avatar: {
    type: String,
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
      type: Boolean,
      default: false,
    },
  },
  social: {
    google: String,
  },
  userRating: {
    gg: {
      type: Number,
    },
    helpful: {
      type: Number,
    },
  },
  birthdate: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ["Female", "Male", "Other"],
  },
  region: {
    type: String,
    enum: [
      "North America",
      "South America",
      "Europe",
      "Asia",
      "Australia",
      "Africa",
    ],
  },
  language: {
    type: [String],
    enum: [
      "DE",
      "EN",
      "ES",
      "FR",
      "HR",
      "IT",
      "JA",
      "NL",
      "PL",
      "PT",
      "RU",
      "ZH",
    ],
  },
  gameTags: {
    discord: String,
    steam: String,
    battlenet: String,
    epic: String,
    uplay: String,
    origin: String,
    riot: String,
    other: String,
  },
  games:  {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Game",
    unique: true,
    default: undefined
  },
  likedUsers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    unique: true,
    default: undefined
  },
  matchedUsers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    unique: true,
    default: undefined
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

userSchema.methods.requiredSettingsFinished = function () {
  if (
    this.birthdate &&
    this.language &&
    this.region &&
    this.gender &&
    this.description &&
    !this.checkIfGameTagsAreEmpty()
  ) {
    console.log("entering required settings")
    this.activation.profileFinished = "true"
    this.save()
  }
}
userSchema.methods.checkIfGameTagsAreEmpty = function() {
  if(this.gameTags.discord === undefined&&
    this.gameTags.steam === undefined&&
    this.gameTags.origin === undefined&&
    this.gameTags.epic === undefined&&
    this.gameTags.other === undefined&&
    this.gameTags.riot === undefined&&
    this.gameTags.uplay === undefined&&
    this.gameTags.battlenet === undefined) {
      return true
    } else {
      return false
    }
}

const User = mongoose.model("User", userSchema)

module.exports = User
