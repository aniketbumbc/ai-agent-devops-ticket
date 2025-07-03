import express from 'express';

import { getTickets, getTicket, createTicket } from '../controllers/ticket.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/:id', authenticate, getTickets);
router.post('/', authenticate, getTicket);
router.post('/', authenticate, createTicket);

export default router;
