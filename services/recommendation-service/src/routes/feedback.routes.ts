import { Router } from 'express';
import { metricsCollector } from '../utils/monitoring';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/click', authenticate, (req, res) => {
  const { recommendationId, clicked } = req.body;
  metricsCollector.trackClick(clicked);
  res.status(200).send();
});

router.post('/satisfaction', authenticate, (req, res) => {
  const { recommendationId, score } = req.body;
  metricsCollector.trackSatisfaction(score);
  res.status(200).send();
});

export default router;