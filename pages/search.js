const router = require('express').Router();
const Flight = require('../models/flight');

router.post('/' , async (req , res) => {
  
  try {
    
    const {eid, sid, monthID, dayID, year} = req.body;
    console.log(eid , sid);
    let flights = await Flight.find();

    flights = flights.filter((flight) =>  parseInt(year) === flight.year && parseInt(monthID) === flight.monthId && parseInt(dayID) === flight.dayId && flight.direction.includes(sid) && flight.direction.includes(eid) && flight.direction[flight.direction.length - 1] !== sid && flight.direction.indexOf(sid) < flight.direction.indexOf(eid));
    console.log(flights);


    flights.map((flight) => {
      let totalPrice = 0;
      let estimatedMinutes = 0;
      const startingIndex = flight.direction.indexOf(sid);
      const endingInxed = flight.direction.indexOf(eid);

      for(let i = startingIndex; i < endingInxed; i++){
        let intercityCurrentPrice = flight.intercity[i].price;
        totalPrice += parseInt(intercityCurrentPrice);
        let intercityCurrentMinutes = flight.intercity[i].minutes;
        estimatedMinutes += parseInt(intercityCurrentMinutes);
      }

      console.log('toplamlar' , totalPrice, estimatedMinutes);

      flight.intercityPrice = totalPrice;
      flight.intercityMinutes = estimatedMinutes;
    })

    console.log(flights);


    
    
    console.log(monthID , dayID , year);

    

    flights.map((flight) => {
      console.log(flight.direction);
    })

    

    return res.status(200).json({message:`oc`, flights});
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({message:'Server error'});
  }

})

module.exports = router;