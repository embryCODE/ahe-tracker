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
      counter: {type: Number, required: true, default: 0}
    }
  ]
})

userSchema.pre('save', function (next) {
  if (!this.foods || this.foods.length === 0) {
    this.foods = [
      {
        foodName: 'Vegetables',
        foodCategory: 'Essential',
        priorityIndex: 0,
        counter: 0
      },
      {
        foodName: 'Fruits',
        foodCategory: 'Essential',
        priorityIndex: 1,
        counter: 0
      },
      {
        foodName: 'Nuts, Seeds, and Healthy Oils',
        foodCategory: 'Recommended',
        priorityIndex: 2,
        counter: 0
      },
      {
        foodName: 'Fish and High-Quality Meats',
        foodCategory: 'Recommended',
        priorityIndex: 3,
        counter: 0
      },
      {
        foodName: 'Whole Grains',
        foodCategory: 'Recommended',
        priorityIndex: 4,
        counter: 0
      },
      {
        foodName: 'Dairy',
        foodCategory: 'Recommended',
        priorityIndex: 5,
        counter: 0
      },
      {
        foodName: 'Refined Grains',
        foodCategory: 'Acceptable',
        priorityIndex: 6,
        counter: 0
      },
      {
        foodName: 'Other Foods',
        foodCategory: 'Acceptable',
        priorityIndex: 7,
        counter: 0
      },
      {
        foodName: 'Low-Quality Meats',
        foodCategory: 'Acceptable',
        priorityIndex: 8,
        counter: 0
      },
      {
        foodName: 'Sweets',
        foodCategory: 'Acceptable',
        priorityIndex: 9,
        counter: 0
      },
      {
        foodName: 'Fried Foods',
        foodCategory: 'Acceptable',
        priorityIndex: 10,
        counter: 0,
      }
    ]
  }
  next()
})

// Create User model
const User = mongoose.model('User', userSchema)

module.exports.User = User
