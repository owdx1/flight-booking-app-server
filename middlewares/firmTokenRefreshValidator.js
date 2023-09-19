const Firm = require('../models/firm');
const jwt = require('jsonwebtoken');
const Refresh = require('../models/refresh');


const firmTokenRefreshValidator = async (req, res, next) => {
    const firm = req.firm;
    const { id, email } = firm;


    const newTokenPayload = { id, email };
    const newFirmToken = jwt.sign(newTokenPayload, process.env.FIRM_TOKEN_SECRET, { expiresIn: '1hr' });
    const newRefreshToken = jwt.sign(newTokenPayload, process.env.FIRM_TOKEN_REFRESH);

    
    const existingFirm = await Refresh.findOne({id});
    if (!existingFirm) {
        // If no refresh token exists, create a new one and insert it
        
        const newRefreshTokenObj = new Refresh({token:newRefreshToken, firm_id:id})
        await newRefreshTokenObj.save();

        
    } else {
        // If a refresh token exists, update the existing token and return it
        const firm_id = existingFirm.firm_id;
        
        Firm.deleteMany({firm_id:firm_id})

        await existingFirm.save();
    }

    req.firmToken = newFirmToken;
    req.firm = firm;

    console.log("Current req.firm:", req.firm);

    next();
};

module.exports = firmTokenRefreshValidator;
