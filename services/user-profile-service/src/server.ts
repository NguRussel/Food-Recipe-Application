import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const PORT = process.env.USER_PROFILE_SERVICE_PORT || 3001;

app.listen(PORT, () => {
  console.log(`User Profile service running on port ${PORT}`);
});