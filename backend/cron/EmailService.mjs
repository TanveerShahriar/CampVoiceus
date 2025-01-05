import nodemailer from 'nodemailer';
import getThreadWithMaxUpvotes from './max_upvote.mjs';
import { User } from '../models/index.mjs'; // Adjust path based on your project structure

async function sendThreadToAllUsers() {
  try {
    // Step 1: Fetch the thread with the most upvotes
    const thread = await getThreadWithMaxUpvotes();
    if (!thread) {
      console.log('No thread found.');
      return;
    }

    // Step 2: Fetch all user email addresses
    const users = await User.find({}, 'email'); // Fetch only the email field
    const emailList = users.map(user => user.email);

    if (!emailList.length) {
      console.log('No users found to email.');
      return;
    }

    // Step 3: Configure the mail transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Use your email service (e.g., Gmail, Outlook)
      auth: {
        user: "apurba.afiat@g.bracu.ac.bd", // Your email address
        pass: 'bojj zibv afpr mdyj', // Your email password or app-specific password
      },
    });

    // Step 4: Define the email content
    const emailSubject = `Thread of the Day: ${thread.title}`;
    const emailBody = `
      <h1>${thread.title}</h1>
      <p>${thread.content || 'No content available for this thread.'}</p>
      <p>Upvotes: ${thread.upvotes.length}</p>
      <p>Tags: ${thread.tags.join(', ') || 'No tags available.'}</p>
    `;

    // Step 5: Send emails
    for (const email of emailList) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: emailSubject,
        html: emailBody,
      });
    }

    console.log('Emails sent successfully to all users.');

  } catch (error) {
    console.error('Error sending emails:', error);
  }
}

export default sendThreadToAllUsers;