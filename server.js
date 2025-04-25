const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/recipes', require('./src/routes/recipeRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
