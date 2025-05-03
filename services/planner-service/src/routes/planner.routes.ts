import { Router } from 'express';
import { PlannerController } from '../controllers/planner.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const plannerController = new PlannerController();

router.post('/plans', authenticate, plannerController.createPlan.bind(plannerController));
router.post('/plans/:planId/generate', authenticate, plannerController.generateSchedule.bind(plannerController));

export default router;