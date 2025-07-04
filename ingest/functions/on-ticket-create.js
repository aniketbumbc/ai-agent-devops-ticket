import { inngest } from '../client.js';
import Ticket from '../../models/ticket.js';
import { NonRetriableError } from 'inngest';
import { sendMail } from '../../utils/mailer.js';
import analyzeTicket from '../../utils/agent.js';
import User from '../../models/user.model.js';

export const onTicketCreated = inngest.createFunction(
  { id: 'on-ticket-created', retries: 2 },
  {
    event: 'ticket/created',
  },

  async ({ event, step }) => {
    try {
      const { ticketId } = event.data;

      const ticket = await step.run('fetch-ticket', async () => {
        const ticketObject = await Ticket.findById(ticketId);

        if (!ticketObject) {
          throw new NonRetriableError('Ticket not found');
        }
        return ticketObject;
      });

      const apiResponse = await analyzeTicket(ticket);

      const relatedSkills = await step.run('ai-processing', async () => {
        let skills = [];

        if (apiResponse) {
          await Ticket.findByIdAndUpdate(ticket._id, {
            priority: !['Low', 'Medium', 'High'].includes(apiResponse.priority)
              ? 'Medium'
              : apiResponse.priority,
            description: apiResponse.summary,
            helpfulNotes: apiResponse.notes,
            status: 'IN_PROGRESS',
            skills: apiResponse?.relatedSkills,
          });

          skills = apiResponse?.relatedSkills;
        }

        return skills;
      });

      const moderator = await step.run('assign-moderator', async () => {
        let user = await User.findOne({
          role: 'moderator',
          skills: {
            $elemMatch: {
              $regex: relatedSkills.join('|'),
            },
          },
        });

        if (!user) {
          user = await User.findOne({
            role: 'admin',
          });
        }

        await Ticket.findByIdAndUpdate(ticket._id, {
          assignedTo: user?._id || null,
        });

        return user;
      });

      await step.run('send-email', async () => {
        if (moderator) {
          const finalTicket = await Ticket.findById(ticket._id);
          await sendMail(
            moderator.email,
            'Ticket assigned',
            `A new ticket is assigned to ${finalTicket.title}
            Ticket details: ${JSON.stringify(finalTicket)}`
          );
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Error running step', error.message);
      return { success: false };
    }
  }
);
