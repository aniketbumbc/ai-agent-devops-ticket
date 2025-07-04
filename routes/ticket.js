import express from 'express';

import { getTickets, getTicket, createTicket } from '../controllers/ticket.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getTickets);
router.get('/:id', authenticate, getTicket);
router.post('/createTicket', authenticate, createTicket);

export default router;
