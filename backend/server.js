require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

// Import routes
const videoRoutes = require('./routes/videoRoutes');
const healthRoutes = require('./routes/healthRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure public directory exists
const publicDir = path.join(__dirname, 'public');
const thumbnailsDir = path.join(publicDir, 'thumbnails');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (!fs.existsSync(thumbnailsDir)) fs.mkdirSync(thumbnailsDir, { recursive: true });

// Serve static files
app.use('/public', express.static(publicDir));
app.use('/thumbnails', express.static(thumbnailsDir));

// Use routes
app.use('/api/videos', videoRoutes);
app.use('/api/health', healthRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running: http://localhost:${PORT}`);
  console.log(`📁 Public directory: ${publicDir}`);
  console.log(`🖼️  Thumbnails: ${thumbnailsDir}`);
});