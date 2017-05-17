// Modules
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const controller = require('./controller')

// Constants
const port = process.env.PORT || 3000

// Setup Express
const app = express()

// Middleware
app.use(bodyParser.json())

// Routing
app.get('/', express.static(path.join(__dirname, '../public')))
app.get('/api/users', controller.getAllUsers)
app.get('/api/users/:id', controller.getUserById)
app.post('/api/users', controller.createUser)
app.put('/api/users/:id/:foodId/:foodCount', controller.updateFoodCount)

// Start server
app.listen(port, () => {
  console.log('Express server listening on port ' + port)
})
