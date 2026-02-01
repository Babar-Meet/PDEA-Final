const express = require('express');
const router = express.Router();
const watchProgressController = require('../controllers/watchProgressController');

// Get progress for a specific video
router.get('/:videoId', watchProgressController.getVideoProgress);

// Update progress for a video
router.post('/update', watchProgressController.updateVideoProgress);

// Delete progress for a video
router.delete('/:videoId', watchProgressController.deleteVideoProgress);

// Get all progress data
router.get('/', watchProgressController.getAllProgress);

module.exports = router;