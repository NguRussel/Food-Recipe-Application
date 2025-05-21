import { Request, Response } from 'express';
import AllergyProfile from '../models/allergy.model';

export const createOrUpdateAllergy = async (req: Request, res: Response) => {
  try {
    const { userId, allergies } = req.body;
    const profile = await AllergyProfile.findOneAndUpdate(
      { userId },
      { allergies },
      { new: true, upsert: true }
    );
    res.status(200).json(profile);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllergyProfile = async (req: Request, res: Response) => {
  try {
    const profile = await AllergyProfile.findOne({ userId: req.params.userId });
    res.status(200).json(profile);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const checkRecipeSafety = async (req: Request, res: Response) => {
  try {
    const { userId, ingredients } = req.body;
    const profile = await AllergyProfile.findOne({ userId });
    if (!profile) return res.status(404).json({ message: 'Allergy profile not found' });

    const conflicting = profile.allergies.filter(allergy =>
      ingredients.includes(allergy.toLowerCase())
    );

    res.status(200).json({
      safe: conflicting.length === 0,
      conflicts: conflicting
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
