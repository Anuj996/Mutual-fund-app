const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const fundRoutes = require('./routes/fundRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, 
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


app.use('/api/auth', authRoutes);    
app.use('/api/funds', fundRoutes);   

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${process.env.PORT || 5001}`);
});
