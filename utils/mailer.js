export const sendMail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_SMTP_HOST,
      port: MAILTRAP_SMTP_PORT,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: MAILTRAP_SMTP_USER,
        pass: MAILTRAP_SMTP_PASS,
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
