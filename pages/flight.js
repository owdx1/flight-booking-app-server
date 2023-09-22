const router = require('express').Router();
const firmTokenValidator = require('../middlewares/firmTokenValidator');
const firmTokenRefreshValidator = require('../middlewares/firmTokenRefreshValidator');
const Flight = require('../models/flight');

router.post('/' , (req , res) => {
  console.log('bodyy' , req.body);
  return res.status(200).json({message:'sa'})
})
router.post('/create-flight' , firmTokenValidator, firmTokenRefreshValidator , async (req , res) => {
  try {
    const {firm} = req;
    const firmId = firm.id;
    
    const {direction , flightTime,flightDateDateObj, flightType,flightDate, selectedCaptainId, selectedHandmanId, doublePathArray} = req.body;
    
  
    const intercity = doublePathArray;
    

    const seats = Array.from({ length: 41 }, (_, index) => ({
      selectedFirstCityId: direction[0],
      selectedSecondCityId: direction[direction.length - 1],
      seatNumber: index + 1,
      bookingCounter: index === 0  ? 1 : 0,
      ...(index === 0 
        ? {
            bookersInformation: 
              [
                {
                  customersName: 'Can',
                  customersID: '21524470162',
                  customersPhone: '507 548 47 03',
                  customersEmail: 'cancam@gmail.com',
                  customersStartingCityId: 26,
                  customersEndingCityId:3,
                  customersTotalPayment:200
                },
                {
                  customersName: 'Cenyy',
                  customersID: '21524320162',
                  customersPhone: '507 548 47 03',
                  customersEmail: 'casam@gmail.com',
                  customersStartingCityId: 26,
                  customersEndingCityId:3,
                  customersTotalPayment:200
                },


            ],
          }
        : {}), 
    }));
    
    
    const totalIncome = 0;
    const totalPassangers = 0;
    const newFlight = new Flight({
      direction,
      flightTime,
      flightDate: `${flightDate.day} ${flightDate.month} ${flightDate.year}`,
      captainId: selectedCaptainId,
      handmanId: selectedHandmanId,
      seats,
      intercity,
      firmId,
      flightType,
      year:flightDate.year,
      monthId: flightDate.monthId,
      dayNameId: flightDate.dayNameId,
      dayId:flightDate.day,
      flightDateDateObj,
      totalIncome,
      totalPassangers
    });
    await newFlight.save();   

  

    return res.status(200).json({message: 'Uçuş kaydedildi!'})
    
  } catch (error) {
    console.error(error)
    return res.status(500).json({message:'Server error creating a flight'})
  }
})

router.get('/get-flights' , firmTokenValidator, firmTokenRefreshValidator, async (req , res) => {
  try {
    const {firm} = req;
    const firmId = firm.id;

    const flights = await Flight.find({firmId:firmId})

    console.log(flights);

    return res.status(200).json({flights})


  } catch (error) {
    console.error(error);
    return res.status(500).json({message:'Server error while fetching flights'})
  }
})






module.exports = router;