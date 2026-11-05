import mongoose from "mongoose";

const product = new mongoose.Schema({
  name: { type: String, required: true },
  fabric: { type: String, required: true },
  price: { type: Number, required: true },
  colors: { type: [String], default: [] },
  note: String,
}, { timestamps: true });

const enquiry = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  phone: { type: String, required: true, trim: true, maxlength: 20 },
  message: { type: String, maxlength: 500 },
  product: String,
}, { timestamps: true });

const account = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, trim: true, lowercase: true, unique: true, maxlength: 254 },
  passwordHash: { type: String, required: true },
}, { timestamps: true });

export const Product = mongoose.model("Product", product);
export const Enquiry = mongoose.model("Enquiry", enquiry);
export const Account = mongoose.model("Account", account);
