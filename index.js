const express = require("express");
const mongoose = require("mongoose");
const firmRouter = require("./pages/firm/auth.js");
const searchRouter = require("./pages/search.js");
const flightRouter = require("./pages/flight.js");
const paymentRouter = require("./pages/payment.js");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://darkshadow15488451:obilet@obilet.ibmc5ic.mongodb.net/?retryWrites=true&w=majority";

const connect = async () => {
  try {
    await mongoose.connect(uri);
    console.log("connected to mongodb");
  } catch (error) {
    console.error(error);
  }
};
try {
  connect();
} catch (error) {
  console.error(error);
}

app.post("/", async (req, res) => {
  try {
    console.log("SUANKI REQ BODY", req.body);
    res.status(200).json({ message: "KİTABINI" });
  } catch (error) {
    console.error(error);
  }
});

app.get("/", async (req, res) => {
  try {
    console.log("geldi");

    return res.status(200).json({ message: "Bravo" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

app.use("/firm", firmRouter);
app.use("/flight", flightRouter);
app.use("/payment", paymentRouter);
app.use("/search", searchRouter);

app.listen(5000, () => {
  console.log("listening on 5000");
});

console.log("hi 1");

setTimeout(() => {
  console.log("hi 2");
}, 0); // waiting for call stack to be empty , then push it on call stack. So it gets executed after everything.
