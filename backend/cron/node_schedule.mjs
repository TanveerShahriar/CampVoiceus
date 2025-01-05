import schedule from 'node-schedule';
import sendThreadToAllUsers from './EmailService.mjs';

// Function to schedule the email job
function scheduleDailyEmail() {
  // Schedule the job to run daily at 12:00 PM
  schedule.scheduleJob('0 12 * * *', async () => {
    console.log('Starting daily email job...');
    try {
      await sendThreadToAllUsers();
      console.log('Daily email job completed successfully.');
    } catch (error) {
      console.error('Error during daily email job:', error);
    }
  });

  console.log('Daily email job scheduled for 12:00 PM.');
}

export default scheduleDailyEmail;