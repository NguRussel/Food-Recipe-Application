import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const PORT = process.env.CATEGORY_SERVICE_PORT || 3003;

app.listen(PORT, () => {
  console.log(`Category service running on port ${PORT}`);
});