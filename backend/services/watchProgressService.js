const fs = require('fs');
const path = require('path');

class WatchProgressService {
  constructor() {
    this.progressFilePath = path.join(__dirname, '../public/watch_progress.json');
    this.progressData = {};
    this.loadProgressData();
  }

  loadProgressData() {
    try {
      if (fs.existsSync(this.progressFilePath)) {
        const data = fs.readFileSync(this.progressFilePath, 'utf8');
        this.progressData = JSON.parse(data);
      } else {
        this.progressData = {};
        this.saveProgressData();
      }
    } catch (error) {
      console.error('Error loading watch progress data:', error);
      this.progressData = {};
    }
  }

  saveProgressData() {
    try {
      fs.writeFileSync(
        this.progressFilePath,
        JSON.stringify(this.progressData, null, 2),
        'utf8'
      );
    } catch (error) {
      console.error('Error saving watch progress data:', error);
    }
  }

  getProgress(videoId) {
    return this.progressData[videoId] || { time: 0, lastWatched: null };
  }

  updateProgress(videoId, time) {
    // Only save if watched more than 2 minutes and less than 95% of video
    if (time < 120) { // 2 minutes = 120 seconds
      // Remove progress if less than 2 minutes
      if (this.progressData[videoId]) {
        delete this.progressData[videoId];
      }
    } else {
      this.progressData[videoId] = {
        time: time,
        lastWatched: new Date().toISOString()
      };
    }
    
    this.saveProgressData();
  }

  deleteProgress(videoId) {
    if (this.progressData[videoId]) {
      delete this.progressData[videoId];
      this.saveProgressData();
    }
  }

  getAllProgress() {
    return this.progressData;
  }
}

// Create singleton instance
const watchProgressService = new WatchProgressService();

module.exports = watchProgressService;