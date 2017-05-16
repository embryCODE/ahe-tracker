const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const restify = require('express-restify-mongoose')
const app = express()
const router = express.Router()
const path = require('path')

app.use(bodyParser.json())
app.use(methodOverride())

const mLabUserName = 'mason'
const mLabPassword = 'bebop111'
mongoose.connect(`mongodb://${mLabUserName}:${mLabPassword}@ds143211.mlab.com:43211/ahe`)

app.use('/', express.static(path.join(__dirname, '../public')))

restify.serve(router, mongoose.model('foods', new mongoose.Schema({
  foodName: String,
  foodCategory: String,
  priorityIndex: Number,
  counter: Number
})))

app.use(router)

app.listen(3000, () => {
  console.log('Express server listening on port 3000')
})
