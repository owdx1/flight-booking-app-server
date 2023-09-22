const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema ({
  firmId: {
    type:String,
    required:true
  },
  direction: [{
    type: Number,
  }
  ],
  flightTime: {
    type:String,
    required:true
  },
  flightType: {
    type:String,
    required:true
  },
  flightDate: {
    type:String,
    required:true
  },
  year: {
    type:Number
  },
  monthId: {
    type:Number
  },
  dayNameId: {
    type:Number
  },
  dayId: {
    type:Number,
  },
  captainId: {
    type: String,
    required:true
  },
  handmanId: {
    type:String,
    required:true
  },
  flightDateDateObj:{
    type:Date
  },
  totalIncome :{
    type:Number,
    required:true
  },
  totalPassangers: {
    type:Number,
    required:true
  },
  seats: [{
    selectedFirstCityId:{
      type:String,
      required:true
    },
    selectedSecondCityId:{
      type:String,
      required:true

    },
    seatNumber: {
      type: Number,
      required: true
    },
    bookingCounter:{
      type:Number,
      required:true
    },
    bookersInformation:[
      {
        customersName: {
          type:String
        },
        customersPhone: {
          type:String
        },
        customersID: {
          type:String
        },
        customersEmail: {
          type:String
        },
        customersStartingCityId: {
         type:Number 
        },
        customersEndingCityId: {
          type:Number
        },
        customersTotalPayment:{
          type: Number
        }
        
      }
    ]
  }],
  intercity:[{
    startingCityId:{
      type: Number
    },
    finishingCityId:{
      type:Number
    },
    price:{
      type: String
    },
    minutes:{
      type: String
    }
  }],
  intercityPrice: Number,
  intercityMinutes: Number,
  searchStarting: Number,
  searchFinishing: Number,
  searchFlightHour:Number,
  searchFlightMinutes:Number,
  firmName:String,
  searchFromStartToSidMinutes:Number,
  searchFromStartToSidHour:Number,
})

module.exports = mongoose.model('Flight', flightSchema);