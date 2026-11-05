import mongoose from "mongoose";
import { Product } from "./models.js";

const data = [
  { name: "Temple Border Kanchipuram", fabric: "Kanchipuram", price: 18500, colors: ["#7a1230", "#c9a24b"], note: "Pure mulberry silk, real zari border" },
  { name: "Peacock Arani Silk", fabric: "Arani", price: 9800, colors: ["#0f5c5a", "#d9b45a"], note: "Light drape, woven in Arani" },
  { name: "Salem Soft Silk Checks", fabric: "Salem", price: 6400, colors: ["#23305e", "#e8d9b0"], note: "Everyday silk, easy to care for" },
  { name: "Mango Motif Kanchipuram", fabric: "Kanchipuram", price: 22000, colors: ["#b3541e", "#f0c75e"], note: "Bridal weight, contrast pallu" },
];

await mongoose.connect(process.env.MONGO_URI);
await Product.deleteMany({});
await Product.insertMany(data);
console.log(`Seeded ${data.length} products`);
await mongoose.disconnect();
