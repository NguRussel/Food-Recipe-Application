import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const PORT = process.env.RECIPE_SERVICE_PORT || 3002;

app.listen(PORT, () => {
  console.log(`Recipe service running on port ${PORT}`);
});