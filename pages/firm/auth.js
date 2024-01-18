const express = require("express");
const router = express.Router();
const Firm = require("../../models/firm");
const Refresh = require("../../models/refresh");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const firmTokenValidator = require("../../middlewares/firmTokenValidator");
const firmTokenRefreshValidator = require("../../middlewares/firmTokenRefreshValidator");
require("dotenv").config();

const phoneNumberRegex =
  /^(5)[0-9][0-9][\s]([0-9]){3}[\s]([0-9]){2}[\s]([0-9]){2}/;

router.post("/login", async (req, res) => {
  console.log("gelen req body", req.body);
  try {
    const { email, password } = req.body;
    const existingFirm = await Firm.findOne({ email: email });

    if (!existingFirm) {
      return res
        .status(400)
        .json({ message: "Bu emaile kayıtlı firma bulunamadı." });
    }
    const isValid = await bcrypt.compare(password, existingFirm.password);
    if (!isValid) {
      return res
        .status(401)
        .json({ message: "Yanlış kullanıcı adı veya şifre" });
    }
    const payload = {
      id: existingFirm.id,
      email: email,
    };
    const firmToken = jwt.sign(payload, process.env.FIRM_TOKEN_SECRET, {
      expiresIn: "1hr",
    });
    const firmTokenRefresh = jwt.sign(payload, process.env.FIRM_TOKEN_REFRESH);
    const existingRefreshToken = await Refresh.findOne({
      firm_id: existingFirm.id,
    });
    if (existingRefreshToken) {
      await Refresh.deleteOne({ firm_id: existingFirm.id });
    }
    const newRefreshToken = new Refresh({
      token: firmTokenRefresh,
      firm_id: existingFirm.id,
    });
    await newRefreshToken.save();
    return res
      .status(200)
      .json({ message: "Başarıyla giriş yapıldı!", firmToken: firmToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/register", async (req, res) => {
  console.log(req.body);

  try {
    const { email, password, phoneNumber, name } = req.body;
    console.log(req.body);
    const existingFirm = await Firm.findOne({ email: email });

    if (existingFirm) {
      return res.status(400).json({ message: "Bu email kullanılmaktadır." });
    }

    const genRound = 10;
    const genSalt = await bcrypt.genSalt(genRound);
    const bcryptPassword = await bcrypt.hash(password, genSalt);
    const newFirm = new Firm({
      email: email,
      phoneNumber: phoneNumber,
      name: name,
      password: bcryptPassword,
    });
    await newFirm.save();
    console.log(newFirm);
    res.status(201).json({ message: "Firma kayıt edildi!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error:", error });
  }
});

router.get("/all-firms", async (req, res) => {
  const firms = await Firm.find();

  firms.forEach((firm) => {
    console.log(firm.id);
  });
  return res.status(200).json(firms);
});

router.get("/all-refresh-tokens", async (req, res) => {
  const tokens = await Refresh.find();
  return res.status(200).json(tokens);
});

router.get(
  "/dashboard",
  firmTokenValidator,
  firmTokenRefreshValidator,
  async (req, res) => {
    const { firm } = req;
    const { email, id } = firm;
    const { firmToken } = req;
    const currentFirm = await Firm.findOne({ email });
    if (!currentFirm) {
      console.log("firma gelmedi");
      return res.status(500).json({ message: "Server error" });
    }
    console.log(currentFirm);
    const sentFirm = {
      email: currentFirm.email,
      name: currentFirm.name,
      phone: currentFirm.phoneNumber,
    };

    return res.status(200).json({ firmToken, firm: sentFirm });
  }
);

module.exports = router;
