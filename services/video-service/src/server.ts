import dotenv from 'dotenv';
import path from 'path';

// Load environment variables before importing app
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Debug information to verify environment variables
console.log('Environment Variables Debug:');
console.log('Current directory:', __dirname);
console.log('Env file path:', path.resolve(__dirname, '../.env'));
console.log('AWS_BUCKET_NAME:', process.env.AWS_BUCKET_NAME);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Import app after environment variables are loaded
import app from './app';

const PORT = process.env.VIDEO_SERVICE_PORT || 3009;

app.listen(PORT, () => {
  console.log(`Video service running on port ${PORT}`);
});