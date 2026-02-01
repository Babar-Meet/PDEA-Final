import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Clock } from 'lucide-react';
import './ResumeOption.css';

const ResumeOption = ({ 
  progress, 
  duration, 
  onResume, 
  onRestart, 
  autoHideDelay = 10000 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState(autoHideDelay / 1000);
  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    // Calculate progress percentage
    if (duration > 0 && progress > 0) {
      const percentage = Math.min((progress / duration) * 100, 100);
      setProgressPercentage(percentage);
    }

    // Auto-hide countdown
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsVisible(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto-hide after delay
    const timeout = setTimeout(() => {
      setIsVisible(false);
      clearInterval(interval);
    }, autoHideDelay);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [progress, duration, autoHideDelay]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  const handleResume = () => {
    onResume(progress);
    setIsVisible(false);
  };

  const handleRestart = () => {
    onRestart();
    setIsVisible(false);
  };

  return (
    <div className={`resume-option ${!isVisible ? 'hidden' : ''}`}>
      <div className="resume-timer">{timeLeft}</div>
      
      <div className="resume-header">
        <Clock size={18} />
        <h4>Resume from where you left off?</h4>
      </div>
      
      <div className="resume-progress">
        <div className="resume-time">
          Watched until {formatTime(progress)} / {formatTime(duration)}
        </div>
        <div className="resume-bar">
          <div 
            className="resume-fill" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      
      <div className="resume-actions">
        <button className="resume-btn primary" onClick={handleResume}>
          <Play size={16} style={{ marginRight: '6px' }} />
          Resume
        </button>
        <button className="resume-btn secondary" onClick={handleRestart}>
          <RotateCcw size={16} style={{ marginRight: '6px' }} />
          Start Over
        </button>
      </div>
    </div>
  );
};

export default ResumeOption;