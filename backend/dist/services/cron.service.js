"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCronJobs = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const Notification_1 = require("../models/Notification");
const email_service_1 = require("./email.service");
const startCronJobs = () => {
    // Retry failed notifications every 10 minutes
    node_cron_1.default.schedule('*/10 * * * *', async () => {
        console.log('Running notification retry job...');
        const pendingNotifications = await Notification_1.Notification.find({
            status: { $in: [Notification_1.NotificationStatus.PENDING, Notification_1.NotificationStatus.FAILED] },
            retryCount: { $lt: 3 },
            sendAt: { $lte: new Date() }
        });
        for (const notif of pendingNotifications) {
            const success = await (0, email_service_1.sendEmail)(notif.email, notif.subject, notif.body);
            if (success) {
                notif.status = Notification_1.NotificationStatus.SENT;
            }
            else {
                notif.status = Notification_1.NotificationStatus.FAILED;
                notif.retryCount += 1;
            }
            await notif.save();
        }
    });
};
exports.startCronJobs = startCronJobs;
