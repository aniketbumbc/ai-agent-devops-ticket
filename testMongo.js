// connect.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
console.log(process.env.MONGO_URI);
const MONGO_URI = process.env.MONGO_URI; // replace with your URI

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
