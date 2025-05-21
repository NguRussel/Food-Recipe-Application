import { Router } from 'express';
import {
  createOrUpdateAllergy,
  checkRecipeSafety,
  getAllergyProfile
} from '../controllers/allergy.controller';

const router = Router();

router.post('/', createOrUpdateAllergy);
router.get('/:userId', getAllergyProfile);
//router.post('/check-safety', checkRecipeSafety); // expects { userId, ingredients }

export default router;
