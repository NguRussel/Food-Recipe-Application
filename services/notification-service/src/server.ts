import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const PORT = process.env.NOTIFICATION_SERVICE_PORT || 3004;

app.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
});