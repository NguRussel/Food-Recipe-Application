import { Request, Response } from 'express';
import { PlannerService } from '../services/planner.service';
import { ValidationError } from '../utils/errors';

export class PlannerController {
  private plannerService: PlannerService;

  constructor() {
    this.plannerService = new PlannerService();
  }

  async createPlan(req: Request, res: Response) {
    try {
      const planData = {
        userId: req.user.id,
        purpose: req.body.purpose,
        numberOfPeople: req.body.numberOfPeople,
        duration: req.body.duration,
        budget: req.body.budget,
        preferences: req.body.preferences
      };

      const plan = await this.plannerService.createMealPlan(planData);
      res.status(201).json(plan);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async generateSchedule(req: Request, res: Response) {
    try {
      const planId = req.params.planId;
      const plan = await this.plannerService.generateMealSchedule(planId);
      res.json(plan);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}