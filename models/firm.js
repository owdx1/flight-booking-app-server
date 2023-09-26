const mongoose = require('mongoose');

const firmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true 
  },
  email: {  
    type: String,
    required: true 
  },
  password: {
    type: String,
    required: true  
  },
  phoneNumber: {
    type: String,
    required:true
  },
  phoneNumber2: {
    type:String,
    required:true
  },
  firmPhotoUrl: String
})

module.exports = mongoose.model('Firm', firmSchema);