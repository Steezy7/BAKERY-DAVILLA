// server.js
require('dotenv').config();
const cors = require("cors");
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors())

// ✅ Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/davila_bakery', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Order Schema & Model
const orderSchema = new mongoose.Schema({
    fullname: String,
    phone_no: String,
    address: String,
    email: String,
    orders: [
        {
            name: String,
            price: Number,
            quantity: Number
        }
    ],
    totalprice: Number,
    status: {
        type: String,
        default: "pending" // Optional: Can be "pending", "confirmed", or "rejected"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Order = mongoose.model("Order", orderSchema);

// ✅ Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Serve the contact form (if needed)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// ✅ Handle contact form submissions (email logic)
app.post('/submit', (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
        logger: false,   // <-- prevent internal logger
        debug: false     // <-- disable debug output
    });

    const mailOptions = {
        from: email,
        to: process.env.EMAIL_TO,
        subject: subject || 'New Contact Form Submission',
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}\nMessage: ${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error:', error);
            return res.status(500).send('Error sending email: ' + error.toString());
        }
        // console.log('Email sent:', info.response);
        res.status(204).send();
    });
});

// ✅ Save customer order
app.post("/api/submit-order", async (req, res) => {
    try {
        console.log("📦 Order received from frontend:");
        console.log(req.body);

        const newOrder = new Order(req.body);
        await newOrder.save();

        res.status(201).json({ message: "✅ Order saved successfully!" });
    } catch (err) {
        console.error("❌ Failed to save order:", err.message);
        res.status(500).json({ error: "❌ Error saving order" });
    }
});

// ✅ Fetch all orders (for admin dashboard)
app.get("/api/orders", async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }); // Newest first
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: "❌ Failed to fetch orders" });
    }
});

// ✅ Update order status (Confirm/Reject)
// ✅ Update order status (Confirm/Reject)
app.patch("/api/orders/:id", async (req, res) => {
  const { status } = req.body;

  // Validate the status first
  const allowedStatuses = ["pending", "confirmed", "rejected"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.status = status;
    await order.save();

    // Create transporter here (inside the route)
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Accept self-signed certs if necessary
      }
    });

    const subject = status === "confirmed"
      ? "Your order has been confirmed!"
      : "Your order has been rejected";

    const htmlMessage = status === "confirmed"
      ? `
        <h2>Hi ${order.fullname},</h2>
        <p>Your order has been <strong>confirmed</strong>! 🎉</p>
        <p>We will start processing it shortly.</p>
      `
      : `
        <h2>Hi ${order.fullname},</h2>
        <p>We are sorry, but your order has been <strong>rejected</strong>.</p>
        <p>Please contact us if you have any questions.</p>
      `;

    await transporter.sendMail({
      from: `"Davila Bakery" <${process.env.EMAIL_USER}>`,
      to: order.email,
      subject,
      html: htmlMessage,
    });

    res.json({ message: "✅ Order status updated and email sent" });
  } catch (err) {
    console.error("❌ Failed to update order:", err);
    res.status(500).json({ error: "❌ Failed to update order" });
  }
});



app.post("/api/payment", async (req, res) => {
    const paymentData = req.body;
    console.log("Payment received:", paymentData);
  
    // Save to DB if needed
  
    res.status(201).json({ message: "Payment recorded!" });
  });

  // ✅ Fetch confirmed orders
    app.get("/api/confirmed-orders", async (req, res) => {
        try {
            const confirmedOrders = await Order.find({ status: "confirmed" }).sort({ createdAt: -1 }); // Newest first
            res.json(confirmedOrders);
        } catch (err) {
            res.status(500).json({ error: "❌ Failed to fetch confirmed orders" });
        }
});

app.get("/api/rejected-orders", async (req, res) => {
    try {
        const rejectedOrders = await Order.find({ status: "rejected" }).sort({ createdAt: -1 });
        res.json(rejectedOrders);
    } catch (err) {
        res.status(500).json({ error: "❌ Failed to fetch rejected orders" });
    }
});

app.post("/api/send-confirmation-email", async (req, res) => {
    const { fullname, phone_no, email, address, orders, totalprice } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false,  // <--- add this line
        }
    });

    const mailOptions = {
        from: `"Davila Bakery" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your Davila Bakery Order Confirmation",
        html: `
            <h2>Thank you for your payment, ${fullname}!</h2>
            <p>Your order has been received and is being processed.</p>
            <p><strong>Phone:</strong> ${phone_no}</p>
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>Total:</strong> $${totalprice}</p>
            <h3>Order Summary:</h3>
            <ul>
                ${orders.map(item => `
                    <li>${item.quantity} × ${item.name} - $${item.price}</li>
                `).join('')}
            </ul>
            <p>You’ll get another email once your order is confirmed or rejected.</p>
            <br>
            <p>– Davila Bakery</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("📧 Confirmation email sent to", email);
        res.status(200).json({ message: "✅ Email sent!" });
    } catch (err) {
        console.error("❌ Failed to send email:", err);
        res.status(500).json({ error: "Failed to send email" });
    }
});


  

// ✅ Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
