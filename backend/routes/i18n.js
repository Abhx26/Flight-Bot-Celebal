const express = require('express');
const router = express.Router();

const supportedLanguages = ['en', 'es', 'fr', 'de', 'hi', 'zh'];

// Get supported languages
router.get('/languages', (req, res) => {
  res.json({ languages: supportedLanguages });
});

// Middleware to set language
function setLanguage(req, res, next) {
  req.language = req.headers['accept-language'] || 'en';
  next();
}

module.exports = { router, setLanguage }; 