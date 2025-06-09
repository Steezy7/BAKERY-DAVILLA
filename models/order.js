const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  phone_no: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },
  orders: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalprice: { type: Number, required: true },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "confirmed", "rejected"],
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
