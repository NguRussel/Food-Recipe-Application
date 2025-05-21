import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const PORT = process.env.AUTH_SERVICE_PORT || 3014;

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
