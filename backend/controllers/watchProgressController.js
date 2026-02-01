const watchProgressService = require('../services/watchProgressService');

// Get watch progress for a video
exports.getVideoProgress = (req, res) => {
  try {
    const videoId = decodeURIComponent(req.params.videoId);
    const progress = watchProgressService.getProgress(videoId);
    
    res.json({
      success: true,
      progress
    });
  } catch (error) {
    console.error('Error getting video progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get video progress'
    });
  }
};

// Update watch progress for a video
exports.updateVideoProgress = (req, res) => {
  try {
    const { videoId, time } = req.body;
    
    if (!videoId || typeof time !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data'
      });
    }

    watchProgressService.updateProgress(videoId, time);
    
    res.json({
      success: true,
      message: 'Progress updated successfully'
    });
  } catch (error) {
    console.error('Error updating video progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update video progress'
    });
  }
};

// Delete watch progress for a video
exports.deleteVideoProgress = (req, res) => {
  try {
    const videoId = decodeURIComponent(req.params.videoId);
    watchProgressService.deleteProgress(videoId);
    
    res.json({
      success: true,
      message: 'Progress deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting video progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete video progress'
    });
  }
};

// Get all watch progress
exports.getAllProgress = (req, res) => {
  try {
    const allProgress = watchProgressService.getAllProgress();
    
    res.json({
      success: true,
      progress: allProgress
    });
  } catch (error) {
    console.error('Error getting all progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get progress data'
    });
  }
};