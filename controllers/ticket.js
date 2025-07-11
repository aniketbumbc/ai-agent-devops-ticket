import { inngest } from '../ingest/client.js';
import Ticket from '../models/ticket.js';

export const createTicket = async (req, res) => {
  try {
    const { title, description, priority = 'medium' } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: 'Title and description are required' });
    }

    const newTicket = await Ticket.create({
      title,
      description,
      priority,
      helpfulNotes: '',
      suggestions: '',
      createdBy: req.user._id.toString(),
    });

    await inngest.send({
      name: 'ticket/created',
      data: {
        ticketId: (await newTicket)._id.toString(),
        title,
        description,
        priority,
        createdBy: req.user._id.toString(),
      },
    });

    return res.status(201).json({
      message: 'Ticket created and processing started',
      ticket: newTicket,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'ticket creation is failed', details: error.message });
  }
};

export const getTickets = async (req, res) => {
  try {
    const user = req.user;
    let tickets = [];
    if (user?.role !== 'user') {
      tickets = await Ticket.find({})
        .populate('assignedTo', ['email', '_id'])
        .sort({ createdAt: -1 });
    } else {
      tickets = await Ticket.find({ createdBy: user._id })
        .select('title description status createdAt')
        .sort({ createdAt: -1 });
    }

    return res.status(200).json(tickets);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: 'getTickets getting failed', details: error.message });
  }
};

export const getTicket = async (req, res) => {
  try {
    const user = req.user;
    let ticket;

    if (user.role !== 'user') {
      ticket = await Ticket.findById(req.params.id).populate('assignedTo', [
        'email',
        '_id',
      ]);
    } else {
      ticket = await Ticket.findOne({
        createdBy: user._id,
        _id: req.params.id,
      }).select('title description status suggestions createdAt');
    }

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    return res.status(200).json({ message: 'Ticket found', ticket });
  } catch (error) {
    return res.status(500).json({
      error: 'getTicket fetching ticket failed',
      details: error.message,
    });
  }
};
