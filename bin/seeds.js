//add seeds here
require("../config/db.config")

const User = require("../models/user.model")
const Game = require("../models/games.model")
const faker = require("faker")
const { random } = require("faker")

const gameNames = [
  "Overwatch",
  "League of Legends",
  "Among Us",
  "Call of Duty",
  "World of Warcraft",
  "Valorant",
  "Fortnite",
]
const gameIDs = []
Promise.all([User.deleteMany(),Game.deleteMany()])
  .then(() => {
    console.log("empty database")

    gameNames.forEach((element) => {
      const game = Game({
        name: element,
      })
      game.save()
      gameIDs.push(game._id)
    })

    for (let i = 0; i < 200; i++) {
      const userName = faker.internet.userName()
      const user = new User({
        name: faker.name.findName(),
        email: faker.internet.email(),
        username: userName,
        avatar: faker.image.avatar(),
        description: faker.lorem.sentence(),
        createdAt: faker.date.past(),
        userRating: {
          gg: faker.random.number(10),
          helpful: faker.random.number(10),
        },
        birthdate: faker.date.past(),
        gender: faker.random.arrayElement(["Female", "Male", "Other"]),
        region: faker.random.arrayElement([
          "North America",
          "South America",
          "Europe",
          "Asia",
          "Australia",
          "Africa",
        ]),
        language: faker.random.arrayElement([
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
        ]),
        gameTags: {
          discord: `${userName}#${faker.random.number(9999)}`,
          steam: userName,
          battlenet: `${userName}#${faker.random.number(9999)}`,
          epic: userName,
          uplay: userName,
          origin: userName,
          riot: `${userName}#${faker.lorem.word()}`,
          other: "none",
        },
        games: addRandomGames(gameIDs),
        likedUsers: function() {
          const array = []
          return array},
        matchedUsers: function() {
          const array = []
          return array}
      })
      user.save()
      .catch()
    }
  })
  .then(() => {
    console.log("Seeding finished")
  })
  .catch()

function addRandomGames(gameIds) {
  const gameIdsSelected = []
  const arrayLength = gameIds.length
  const gamesNumber = faker.random.number({ min: "1", max: arrayLength })
  for (let i = 0; i < gamesNumber; i++) {
    idSelectedRandomly = gameIds[faker.random.number({ min: 0, max: gameIds.length -1 })]
    //console.log(idSelectedRandomly)
    if (!gameIdsSelected.includes(idSelectedRandomly)) {
      gameIdsSelected.push(idSelectedRandomly)
    }
  }
  return gameIdsSelected
}
