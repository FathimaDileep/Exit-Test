const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

// MongoDB Model for OTP
const otpSchema = new mongoose.Schema({
    email: String,
    otp: String,
    createdAt: { type: Date, default: Date.now, index: { expires: 300 } } // OTP expires in 5 minutes
});

const OTP = mongoose.model('OTP', otpSchema);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/otp_verification', { useNewUrlParser: true, useUnifiedTopology: true });

// Endpoint to send OTP
app.post('/send-otp', async (req, res) => {
    const { email } = req.body;

    // Generate random OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Save OTP in the database
    await OTP.create({ email, otp });
    // Send OTP via email
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'fathimadileep2019@gmail.com',
            pass: 'ycvh flkd obyw rqus'
        }
    });

    const mailOptions = {
        from: 'fathimadileep2019@gmail.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send('Error sending email');
        }
        res.status(200).send('OTP sent');
    })
})

// Endpoint to verify OTP
app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    const validOTP = await OTP.findOne({ email, otp });

    if (validOTP) {
        res.status(200).send('OTP verified');
    } else {
        res.status(400).send('Invalid OTP');
    }
});

// Start the server
app.listen(5000, () => {
    console.log('Server started on port 5000');
});
