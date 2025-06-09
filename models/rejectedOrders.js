const mongoose = require("mongoose");

const rejectedOrdersSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  phone_no: String,
  address: String,
  totalprice: Number,
  orders: Array,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("RejectedOrder", rejectedOrdersSchema);
