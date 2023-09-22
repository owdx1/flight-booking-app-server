const router = require('express').Router();
const Flight = require('../models/flight');
const Firm = require('../models/firm');

router.post('/' , async (req , res) => {
  
  try {
    const {eid, sid, monthID, dayID, year ,type} = req.body;
    console.log('gelen type' , type);
    let flights = await Flight.find();
    let firms = await Firm.find();
    console.log('tüm flightların sayısı' ,  flights.length);

    flights = flights.filter((flight) =>  parseInt(year) === flight.year && parseInt(monthID) === flight.monthId && parseInt(dayID) === flight.dayId && flight.direction.includes(sid) && flight.direction.includes(eid) && flight.direction[flight.direction.length - 1] !== sid && (flight.direction.indexOf(sid) < flight.direction.indexOf(eid)) && flight.flightType === type);
    console.log(flights);


    flights.map((flight) => {
      const currentFirm = firms.filter((firm) => firm.id === flight.firmId);
      const current = currentFirm[0];
      let totalPrice = 0;
      let estimatedMinutes = 0;
      let searchFromStartToSidMinutes = 0;
      const startingIndex = flight.direction.indexOf(sid);
      const endingInxed = flight.direction.indexOf(eid);

      for (let i = startingIndex; i < endingInxed; i++){
        let intercityCurrentPrice = flight.intercity[i].price;
        totalPrice += parseInt(intercityCurrentPrice);
        let intercityCurrentMinutes = flight.intercity[i].minutes;
        estimatedMinutes += parseInt(intercityCurrentMinutes);
      }
      for(let j = 0; j < startingIndex; j++) {
        let addMinutes = flight.intercity[j].minutes;
        searchFromStartToSidMinutes += parseInt(addMinutes);
      }

      

      console.log('toplamlar' , totalPrice, estimatedMinutes);

      flight.intercityPrice = totalPrice;
      flight.intercityMinutes = estimatedMinutes;
      flight.searchStarting = sid;
      flight.searchFinishing = eid;
      flight.firmName = current.name;
      console.log(flight.flightTime);

      let times = flight.flightTime.split(':')
      console.log(times);
      let totalDakika = parseInt(times[1]) + searchFromStartToSidMinutes;
      let akrep = parseInt(times[0]) + Math.floor(totalDakika / 60);
      akrep = akrep % 24;

      console.log(flight.flightTime);
      flight.searchFlightHour = Math.floor(totalDakika / 60);;
      flight.searchFlightMinutes = totalDakika % 60;
      flight.searchFromStartToSidHour = akrep;
      flight.searchFromStartToSidMinutes = totalDakika % 60;
    })

    



    
    
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