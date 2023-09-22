const mongoose = require('mongoose');


const subFlightSchema = new mongoose.Schema({
  firmId: {
    type:String,
    required:true
  }
})