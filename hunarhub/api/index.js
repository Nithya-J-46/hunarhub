const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/entrepreneurs', require('./routes/entrepreneurs'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/reviews', require('./routes/reviews'));

// Health check
app.get('/', (req, res) => res.json({ message: 'HunarHub API Running ✅' }));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
  })
  .catch(err => console.error('MongoDB connection error:', err));
   import serverless from "serverless-http";
      export default serverless(app);