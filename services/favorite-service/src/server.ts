import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const PORT = process.env.FAVORITE_SERVICE_PORT || 3007;

app.listen(PORT, () => {
  console.log(`Favorite service running on port ${PORT}`);
});