// Modules
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const controller = require('./controller')
const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models').User

// Constants
const port = process.env.PORT || 3000
const dbUrl = process.env.DB_URL || require('../config').dbUrl

// Set Mongoose to use native promises
mongoose.Promise = global.Promise

// Connect to mLab Mongo database
mongoose.connect(dbUrl)

// Configure Passport
passport.use(new LocalStrategy({usernameField: 'email'},
  function (email, password, done) {
    User.findOne({email: email}, function (err, user) {
      if (err) { return done(err) }
      if (!user) { return done(null, false) }
      if (password !== user.password) { return done(null, false) }
      return done(null, user)
    })
  }
))
passport.serializeUser(function (user, done) {
  done(null, user._id)
})
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user)
  })
})

// Setup Express
const app = express()

// Middleware
app.use(require('cookie-parser')())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(require('express-session')({secret: 'bourbon', resave: true, saveUninitialized: true}))
app.use(passport.initialize())
app.use(passport.session())

app.post('/login',
  passport.authenticate('local', {failureRedirect: '/login'}),
  function (req, res) {
    res.redirect('/')
  })

// Routing
app.get(express.static(path.join(__dirname, '../public')))
app.get('/api/users', controller.getAllUsers)
app.get('/api/users/:id', controller.getUserById)
app.post('/api/users', controller.createUser)
app.put('/api/users/:id/foods/:foodId/count/:foodCount', controller.updateFoodCount)
app.get('/login', function (req, res) {
  res.send('This is the login page')
})
app.get('/', function (req, res) {
  res.send('This is the home page')
})

// Start server
app.listen(port, () => {
  console.log('Express server listening on port ' + port)
})
