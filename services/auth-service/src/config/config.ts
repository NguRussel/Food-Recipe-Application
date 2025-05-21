export const config = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  },
  twoFactor: {
    appName: process.env.TWO_FACTOR_APP_NAME || 'CameroonFoodRecipe'
  }
};