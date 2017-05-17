// Modules
const User = require('./models').User

module.exports.getAllUsers = function (req, res, next) {
  User.find()
    .then(function (results) {
      res.json(results)
    })
    .catch(function (error) {
      res.json(error)
    })
}

module.exports.getUserById = function (req, res, next) {
  User.findById(req.params.id)
    .then(function (results) {
      res.json(results)
    })
    .catch(function (error) {
      res.json(error)
    })
}

module.exports.createUser = function (req, res, next) {
  User.create(req.body)
    .then(function (results) {
      res.json(results)
    })
    .catch(function (error) {
      res.json(error)
    })
}

module.exports.updateFoodCount = function (req, res, next) {
  User.findById(req.params.id)
    .then(function (foundUser) {
      let requestedFoodId = JSON.stringify(req.params.foodId)
      let requestedFoodCount = req.params.foodCount

      // Loop through foods on user, find food by foodId, update counter
      for (let i = 0; i < foundUser.foods.length; i++) {
        let currentFood = foundUser.foods[i]
        let currentFoodId = JSON.stringify(currentFood._id)

        if (currentFoodId === requestedFoodId) {
          currentFood.counter = requestedFoodCount
        }
      }

      // Save to database and send updatedUser
      foundUser.save(function (err, updatedUser) {
        if (err) {
          res.json(err)
        } else {
          res.json(updatedUser)
        }
      })
    })
    .catch(function (error) {
      res.json(error)
    })
}
