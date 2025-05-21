import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const PORT = process.env.SCANNER_SERVICE_PORT || 3007;

app.listen(PORT, () => {
  console.log(`Scanner service running on port ${PORT}`);
});