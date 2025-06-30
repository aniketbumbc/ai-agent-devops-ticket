import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Mongo DB connected ');
    app.listen(PORT, () => console.log(`Server at http://locolhost:${PORT}`));
  })
  .catch((err) => console.error('Mongo DB Error ', err));
