const mongoose = require("mongoose")

const gameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: String,
})

const Game  = mongoose.model("Game", gameSchema)

module.exports = Game