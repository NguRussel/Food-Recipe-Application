import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    await transporter.sendMail({
      from: '"Your App" <no-reply@yourapp.com>',
      to,
      subject,
      text
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};