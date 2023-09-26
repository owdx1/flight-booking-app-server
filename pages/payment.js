const router = require('express').Router();
const Firm = require('../models/firm');
const Flight = require('../models/flight');
const months = require('../data/months');


router.post('/receive-payment' , async (req , res) => {

  try {
    const receivedData = req.body;
    const {stateData, email ,tcno, phone , passangerName , isSelected , card , cvc , monthAndYear} = receivedData;
    const {selectedSeatId, monthID , year, dayID, type, flightTime, gender, seatNo, eid , sid, firmName, bookingPrice} = stateData;
    console.log('suanki seat id' , selectedSeatId);
    console.log('received data ' , receivedData);
    const customersFlightDate = `${dayID} / ${months[monthID]} / ${year}`
    const flight = await Flight.findOne({
      'seats._id': selectedSeatId,
    });

    if (!flight) {
      // Flight not found for the selected seat ID
      return res.status(404).json({ message: 'Flight not found for the selected seat ID.' });
    }
    // general flight updates
    flight.totalIncome += bookingPrice;
    flight.totalPassangers += 1;

    const seatArray = flight.seats.filter((seat) => seat.id === selectedSeatId);

    if(seatArray.length === 0 ) return res.status(401).json({message:'Incorrect Seat ID.'})

    const seat = seatArray[0];

    console.log('suanki seat', seat);
    const firtSelectedCity = seat.selectedFirstCityId;
    const secondSelectedCity = seat.selectedSecondCityId;

    console.log('bana gelen sid eid' , sid , eid);
    console.log('koltuğun first second' ,  firtSelectedCity , secondSelectedCity);
    console.log('tekrardan direction' , flight.direction);



    firstIndex = flight.direction.indexOf(parseInt(firtSelectedCity));
    secondIndex = flight.direction.indexOf(parseInt(secondSelectedCity));
    newFirstIndex = flight.direction.indexOf(parseInt(sid));
    newSecondIndex = flight.direction.indexOf(parseInt(eid));
    console.log('sırasıyla indexler' , firstIndex , secondIndex, newFirstIndex , newSecondIndex);
    let arr = [newFirstIndex , newSecondIndex , firstIndex , secondIndex];

    arr = arr.filter((element) => element !== -1)

    console.log('min - max dan önceki arr' , arr);

    const min = Math.min(...arr);
    const max = Math.max(...arr);

    console.log('suanki min - max' , min , max);

    seat.selectedFirstCityId = min;
    seat.selectedSecondCityId = max;
    seat.bookingCounter += 1;
    

    seat.bookersInformation.push({
      customersName: passangerName,
      customersPhone:phone,
      customersEmail: email,
      customersID: tcno,
      customersTotalPayment:bookingPrice,
      customersStartingCityId:sid,
      customersEndingCityId: eid,
      customersGender: gender,
      customersFlightHour: flightTime,
      customersFlightDate:customersFlightDate,
      isSubscribed: isSelected,
      customersCardNo:card,
      customersmonthAndYear:monthAndYear,
      customersCVC: cvc
    })
    
    await flight.save();
    return res.status(200).json({message : 'Başarılı'})

    
  } catch (error) {
    console.error(error);
    return res.status(500).json({message:'Server error payment'})
  }

})




module.exports = router;