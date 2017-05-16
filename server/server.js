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

// Connect to mLab Mongo database
mongoose.connect(config.dbURL)

// Create Food schema
const foodSchema = new mongoose.Schema({
  foodName: String,
  foodCategory: String,
  priorityIndex: Number,
  counter: Number
})

// Create Food model
const Food = mongoose.model('Food', foodSchema)

// Create endpoints based on Food model
restify.serve(router, Food)

app.use('/', express.static(path.join(__dirname, '../public')))
app.use(router)

app.listen(3000, () => {
  console.log('Express server listening on port 3000')
})
