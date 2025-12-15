// required libraries
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // cross-origin resource sharing
require('dotenv').config();
const taskRoutes = require('./routes/tasks');


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/tasks', taskRoutes);

// Connect to DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    const port = process.env.PORT || 5001;
    app.listen(port, () => {
      console.log(`Connected to DB & Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

