import express from 'express';
const router = express.Router();

// Example route
router.get('/', (req, res) => {
    res.send('Auth route is working!');
});

export default router;
