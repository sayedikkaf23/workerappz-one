// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create an instance of the Express app
const app = express();

// Check the environment mode (Development or Production)
if (process.env.NODE_ENV === 'development') {
  console.log('Running in Development Mode');
} else {
  console.log('Running in Production Mode');
}

// Connect to MongoDB using the connection string in .env
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error:', err));

// Set the port using environment variable or default to 5000
const port = process.env.PORT || 5000;

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
