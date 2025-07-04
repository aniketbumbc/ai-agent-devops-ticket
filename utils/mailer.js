import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendMail = async (to, subject, text) => {
  console.log('Hello insidesend mail');
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_SMTP_HOST,
      port: process.env.MAILTRAP_SMTP_PORT,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: process.env.MAILTRAP_SMTP_USER,
        pass: process.env.MAILTRAP_SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: '"IT Devops Ticket Team" <team@example.com>', // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
    });

    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Mail Error ', error.message);

    throw error;
  }
};
