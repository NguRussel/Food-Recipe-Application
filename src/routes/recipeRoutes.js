import express from 'express';
const router = express.Router();

// Example route
router.get('/', (req, res) => {
  res.send('Recipe route is working!');
});

export default router; // <-- very important
