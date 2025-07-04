import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/user.js';
import ticketRoutes from './routes/ticket.js';
import { serve } from 'inngest/express';
import { inngest } from './ingest/client.js';
import { onUserSignup } from './ingest/functions/on-signup.js';
import { onTicketCreated } from './ingest/functions/on-ticket-create.js';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.use('/api/auth', userRoutes);
app.use('/api/tickets', ticketRoutes);

app.use(
  '/api/inngest',
  serve({
    client: inngest,
    functions: [onTicketCreated, onUserSignup],
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Mongo DB connected ');
    app.listen(PORT, () => console.log(`Server at http://localhost:${PORT}`));
  })
  .catch((err) => console.error('Mongo DB Error ', err));
