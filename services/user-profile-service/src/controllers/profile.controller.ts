import { Request, Response } from 'express';
import UserProfile, { IUserProfile } from '../models/user-profile.model';
import mongoose from 'mongoose';

export class ProfileController {
  public async createProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        res.status(401).json({ error: 'User ID not found in token' });
        return;
      }

      const existingProfile = await UserProfile.findOne({ userId });
      if (existingProfile) {
        res.status(409).json({ error: 'Profile already exists for this user' });
        return;
      }

      const profile: IUserProfile = new UserProfile({
        ...req.body,
        userId
      });
      const savedProfile = await profile.save();
      res.status(201).json(savedProfile);
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      if (!userId) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }

      const profile = await UserProfile.findOne({ userId });
      if (!profile) {
        res.status(404).json({ error: 'Profile not found' });
        return;
      }
      res.status(200).json(profile);
    } catch (error) {
      if (error instanceof mongoose.Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      if (!userId) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }

      const profile = await UserProfile.findOneAndUpdate(
        { userId },
        req.body,
        { new: true, runValidators: true }
      );
      if (!profile) {
        res.status(404).json({ error: 'Profile not found' });
        return;
      }
      res.status(200).json(profile);
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async updatePreferences(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { dietaryPreferences, allergies, preferredCuisines } = req.body;

      if (!userId) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }

      if (!dietaryPreferences && !allergies && !preferredCuisines) {
        res.status(400).json({ error: 'No preferences provided for update' });
        return;
      }

      const updateData: Partial<IUserProfile> = {};
      if (dietaryPreferences) updateData.dietaryPreferences = dietaryPreferences;
      if (allergies) updateData.allergies = allergies;
      if (preferredCuisines) updateData.preferredCuisines = preferredCuisines;

      const profile = await UserProfile.findOneAndUpdate(
        { userId },
        updateData,
        { new: true, runValidators: true }
      );
      if (!profile) {
        res.status(404).json({ error: 'Profile not found' });
        return;
      }
      res.status(200).json(profile);
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async addFavoriteRecipe(req: Request, res: Response): Promise<void> {
    try {
      const { userId, recipeId } = req.params;
      if (!userId || !recipeId) {
        res.status(400).json({ error: 'User ID and Recipe ID are required' });
        return;
      }

      const profile = await UserProfile.findOneAndUpdate(
        { userId },
        { $addToSet: { favoriteRecipes: recipeId } },
        { new: true }
      );
      if (!profile) {
        res.status(404).json({ error: 'Profile not found' });
        return;
      }
      res.status(200).json(profile);
    } catch (error) {
      if (error instanceof mongoose.Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async removeFavoriteRecipe(req: Request, res: Response): Promise<void> {
    try {
      const { userId, recipeId } = req.params;
      if (!userId || !recipeId) {
        res.status(400).json({ error: 'User ID and Recipe ID are required' });
        return;
      }

      const profile = await UserProfile.findOneAndUpdate(
        { userId },
        { $pull: { favoriteRecipes: recipeId } },
        { new: true }
      );
      if (!profile) {
        res.status(404).json({ error: 'Profile not found' });
        return;
      }
      res.status(200).json(profile);
    } catch (error) {
      if (error instanceof mongoose.Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}