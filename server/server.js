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
        return done(null, false, {message: 'User not found'})
      }

      // TODO: Secure all passwords with bcrypt or something
      if (password !== user.password) {
        return done(null, false, {message: 'Incorrect password'})
      }

      return done(null, user)
    })
  }
))

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user)
  })
})

// Middleware function to check authentication
const checkAuthorization = function (req, res, next) {
  if (!req.isAuthenticated()) {
    res.sendStatus(401)
  } else {
    next()
  }
}

// Setup Express app
const app = express()

// Middleware
app.set('port', process.env.PORT || 3000)
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({secret: 'bourbon', resave: true, saveUninitialized: true}))
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use(express.static(path.join(__dirname, '../public')))

app.get('/api/users', checkAuthorization, controller.getAllUsers)
app.get('/api/users/:id', checkAuthorization, controller.getUserById)
app.post('/api/users', controller.createUser)
app.put('/api/users/:id/foods/:foodId/count/:foodCount', checkAuthorization, controller.updateFoodCount)

app.post('/login', passport.authenticate('local'), (req, res) => {
  res.redirect('/')
})
app.post('/logout', (req, res) => {
  req.logOut()
  res.sendStatus(200)
})
app.get('/loggedin', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(req.user)
  } else {
    res.send(false)
  }
})

// Start server
app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'))
})
