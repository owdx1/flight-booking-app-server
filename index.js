const express = require('express');
const mongoose = require('mongoose');
const firmRouter = require('./pages/firm/auth.js');
const searchRouter = require('./pages/search.js');
const flightRouter = require('./pages/flight.js');
const cors = require('cors');



const app = express();
app.use(cors());
app.use(express.json());


const uri = 'mongodb+srv://darkshadow15488451:obilet@obilet.ibmc5ic.mongodb.net/?retryWrites=true&w=majority'

const connect = async () => {
  try {
    await mongoose.connect(uri)
    console.log('connected to mongodb');
    
  } catch (error) {
    console.error(error)
  }
}
try {
  connect();  
} catch (error) {
  console.error(error)
}

app.post('/' , async (req, res) =>{
  try {
    
    console.log("SUANKI REQ BODY" ,req.body);
    res.status(200).json({message:'KİTABINI'})
  } catch (error) {
    console.error(error)
  }
  
})



app.use('/firm', firmRouter);
app.use('/flight' , flightRouter);

app.use('/search' , searchRouter);

app.listen(5000, () => {
  console.log('listening on 5000');
})