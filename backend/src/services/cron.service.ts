import cron from 'node-cron';
import { Notification, NotificationStatus } from '../models/Notification';
import { sendEmail } from './email.service';

export const startCronJobs = () => {
  // Retry failed notifications every 10 minutes
  cron.schedule('*/10 * * * *', async () => {
    console.log('Running notification retry job...');
    const pendingNotifications = await Notification.find({
      status: { $in: [NotificationStatus.PENDING, NotificationStatus.FAILED] },
      retryCount: { $lt: 3 },
      sendAt: { $lte: new Date() }
    });

    for (const notif of pendingNotifications) {
      const success = await sendEmail(notif.email, notif.subject, notif.body);
      if (success) {
        notif.status = NotificationStatus.SENT;
      } else {
        notif.status = NotificationStatus.FAILED;
        notif.retryCount += 1;
      }
      await notif.save();
    }
  });
};
