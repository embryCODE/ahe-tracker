const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const restify = require('express-restify-mongoose')
const app = express()
const router = express.Router()
const path = require('path')
const config = require('../config')

app.use(bodyParser.json())
app.use(methodOverride())

mongoose.connect(config.dbURL)

restify.serve(router, mongoose.model('foods', new mongoose.Schema({
  foodName: String,
  foodCategory: String,
  priorityIndex: Number,
  counter: Number
})))

// Routers
app.use('/', express.static(path.join(__dirname, '../public')))
app.use(router)

app.listen(3000, () => {
  console.log('Express server listening on port 3000')
})
