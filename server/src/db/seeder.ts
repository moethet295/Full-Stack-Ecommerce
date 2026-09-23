import mongoose from "mongoose";

import { Product } from "../models/product";
import { products } from "./data";

async function seed() {
  try {
    await mongoose.connect("mongodb://localhost:27017/fashion-king");
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}
seed();

