// Modules
const mongoose = require('mongoose')

// Create User schema
const userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  foods: [
    {
      foodName: {type: String, required: true},
      foodCategory: {type: String, required: true},
      priorityIndex: {type: Number, required: true},
      counter: {type: Number, required: true, default: 0},
      foodId: mongoose.Schema.Types.ObjectId
    }
  ]
})

// Create User model
const User = mongoose.model('User', userSchema)

module.exports.User = User
