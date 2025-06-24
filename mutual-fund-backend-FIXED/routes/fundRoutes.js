const express = require('express');
const User = require('../models/User');
const requireAuth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/save', requireAuth, async (req, res) => {
  const { schemeCode, schemeName, nav } = req.body;
  const userId = req.user.id;

  if (!schemeCode || !schemeName || !nav) {
    return res.status(400).json({ message: 'Invalid fund data' });
  }

  try {
    const user = await User.findById(userId);
    const alreadySaved = user.savedFunds.find(f => f.schemeCode === schemeCode);

    if (!alreadySaved) {
      user.savedFunds.push({ schemeCode, schemeName, nav });
      await user.save();
    }

    res.status(200).json({ message: 'Fund saved successfully', savedFunds: user.savedFunds });
  } catch (err) {
    console.error('Save fund error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/saved', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ savedFunds: user.savedFunds });
  } catch (err) {
    console.error('Fetch saved funds error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
