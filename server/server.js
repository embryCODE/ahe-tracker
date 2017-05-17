// Modules
const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
const Strategy = require('passport-local').Strategy

// Custom modules
const User = require('./models').User
const controller = require('./controller')

// Constants
const port = process.env.PORT || 3000
const dbUrl = process.env.DB_URL || require('../config').dbUrl

// Mongoose setup
mongoose.Promise = global.Promise
mongoose.connect(dbUrl)

// Passport setup
passport.use(new Strategy({usernameField: 'email'},
  function (email, password, done) {
    User.findOne({email: email}, function (err, user) {
      if (err) {
        return done(err)
      }

      if (!user) {
        return done(null, false)
      }

      if (password !== user.password) {
        return done(null, false)
      }

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

// Setup Express app
const app = express()

// Middleware
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({secret: 'bourbon', resave: true, saveUninitialized: true}))
app.use(passport.initialize())
app.use(passport.session())

// Routing
app.use(express.static(path.join(__dirname, '../public')))
app.get('/api/users', controller.getAllUsers)
app.get('/api/users/:id', controller.getUserById)
app.post('/api/users', controller.createUser)
app.put('/api/users/:id/foods/:foodId/count/:foodCount', controller.updateFoodCount)
app.post('/login', passport.authenticate('local', {failureRedirect: '/login'}), function (req, res) {
  res.redirect('/')
})

// TODO: Delete this /login route and replace functionality in frontend
app.get('/login', function (req, res) {
  res.send('This is the temporary login page')
})

// Start server
app.listen(port, () => {
  console.log('Express server listening on port ' + port)
})
