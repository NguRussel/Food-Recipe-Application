import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const PORT = process.env.SEARCH_SERVICE_PORT || 3003;

app.listen(PORT, () => {
  console.log(`Search service running on port ${PORT}`);
});