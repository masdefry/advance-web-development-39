import nodemailer from 'nodemailer';
import { NODEMAILER_GOOGLE_APP_PASSWORD } from './env.config';

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ryan.fandy@gmail.com",
    pass: NODEMAILER_GOOGLE_APP_PASSWORD, // The 16-character App Password
  },
  secure: false, 
  tls: {
    rejectUnauthorized: false
  }
});

export default transporter;