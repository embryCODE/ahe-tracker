// Modules
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const controller = require('./controller')
const mongoose = require('mongoose')

// Constants
const port = process.env.PORT || 3000
const dbUrl = process.env.DB_URL || require('../config').dbUrl

// Set Mongoose to use native promises
mongoose.Promise = global.Promise

// Connect to mLab Mongo database
mongoose.connect(dbUrl)

// Setup Express
const app = express()

// Middleware
app.use(bodyParser.json())

// Routing
app.get('/api/users', controller.getAllUsers)
app.get('/api/users/:id', controller.getUserById)
app.post('/api/users', controller.createUser)
app.put('/api/users/:id/foods/:foodId/count/:foodCount', controller.updateFoodCount)
app.get('/*', express.static(path.join(__dirname, '../public')))

// Start server
app.listen(port, () => {
  console.log('Express server listening on port ' + port)
})
