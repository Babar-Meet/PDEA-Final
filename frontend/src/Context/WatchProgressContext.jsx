import React, { createContext, useContext, useState, useEffect } from 'react';

const WatchProgressContext = createContext();

export const useWatchProgress = () => {
  const context = useContext(WatchProgressContext);
  if (!context) {
    throw new Error('useWatchProgress must be used within WatchProgressProvider');
  }
  return context;
};

export const WatchProgressProvider = ({ children }) => {
  const [progressData, setProgressData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch progress for a specific video
  const fetchVideoProgress = async (videoId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/watch-progress/${encodeURIComponent(videoId)}`);
      const data = await response.json();
      
      if (data.success) {
        return data.progress;
      }
      return null;
    } catch (error) {
      console.error('Error fetching video progress:', error);
      return null;
    }
  };

  // Update progress for a video
  const updateVideoProgress = async (videoId, time) => {
    try {
      const response = await fetch('http://localhost:5000/api/watch-progress/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId, time })
      });
      
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error updating video progress:', error);
      return false;
    }
  };

  // Delete progress for a video
  const deleteVideoProgress = async (videoId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/watch-progress/${encodeURIComponent(videoId)}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error deleting video progress:', error);
      return false;
    }
  };

  // Get all progress
  const fetchAllProgress = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/watch-progress');
      const data = await response.json();
      
      if (data.success) {
        setProgressData(data.progress || {});
      }
    } catch (error) {
      console.error('Error fetching all progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format time for display
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Check if progress is significant (more than 2 minutes)
  const isProgressSignificant = (progress) => {
    return progress && progress.time > 120; // 2 minutes = 120 seconds
  };

  useEffect(() => {
    fetchAllProgress();
  }, []);

  return (
    <WatchProgressContext.Provider
      value={{
        progressData,
        isLoading,
        fetchVideoProgress,
        updateVideoProgress,
        deleteVideoProgress,
        fetchAllProgress,
        formatTime,
        isProgressSignificant
      }}
    >
      {children}
    </WatchProgressContext.Provider>
  );
};