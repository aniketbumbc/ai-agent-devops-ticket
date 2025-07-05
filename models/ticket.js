import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, default: 'Todo' },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  priority: String,
  deadLine: Date,
  notes: String,
  skills: [String],
  helpfulNotes: String,
  suggestions: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Ticket', ticketSchema);
