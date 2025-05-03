import dotenv from 'dotenv';
import app from './app';
import { setupMonitoring } from './utils/monitoring';
import { setupABTesting } from './utils/ab-testing';

dotenv.config();

const PORT = process.env.RECOMMENDATION_SERVICE_PORT || 3005;

// Setup monitoring and analytics
setupMonitoring();

// Setup A/B testing
setupABTesting();

app.listen(PORT, () => {
  console.log(`Recommendation service running on port ${PORT}`);
});