const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type:String,
    required: true
  },
  firm_id: {
    type:String,
    required: true
  },
})

module.exports = mongoose.model('Refresh' , refreshTokenSchema);
