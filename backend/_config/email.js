const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
dotenv.config();
const transporter = nodemailer.createTransport({
    
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SENDER,
    
    pass: process.env.EMAIL_PASSWORD
  }
});
// console.log(process.env.EMAIL_PASSWORD)


module.exports = transporter;
