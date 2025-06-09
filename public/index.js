// require("dotenv").config();
// const express = require("express");
// const nodemailer = require("nodemailer");
// const cors = require("cors");
// const bodyParser = require("body-parser");

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // Email sending route
// app.post("/send-email", async (req, res) => {
//     const { name, email, phone, subject, message } = req.body;

//     let transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//             user: process.env.EMAIL_USER, // Your email
//             pass: process.env.EMAIL_PASS  // Your email app password
//         }
//     });

//     let mailOptions = {
//         from: email,
//         to: process.env.EMAIL_USER,
//         subject: `Contact Form: ${subject}`,
//         text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`
//     };

//     try {
//         await transporter.sendMail(mailOptions);
//         res.json({ message: "Email sent successfully!" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Failed to send email." });
//     }
// });

// app.listen(3000, () => console.log("Server running on port 3000"));
