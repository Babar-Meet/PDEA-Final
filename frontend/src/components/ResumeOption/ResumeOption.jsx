import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Clock } from 'lucide-react';
import './ResumeOption.css';

const ResumeOption = ({ 
  progress, 
  duration, 
  onResume, 
  onRestart, 
  autoHideDelay = 10000,
  autoResume = true  // New prop to control auto-resume behavior
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState(autoHideDelay / 1000);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const hasAutoResumedRef = useRef(false);

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
          
          // Auto-resume when countdown completes
          if (autoResume && !hasAutoResumedRef.current) {
            hasAutoResumedRef.current = true;
            onResume(progress);
          }
          
          setIsVisible(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto-hide after delay
    const timeout = setTimeout(() => {
      clearInterval(interval);
      
      // Auto-resume when timeout completes
      if (autoResume && !hasAutoResumedRef.current) {
        hasAutoResumedRef.current = true;
        onResume(progress);
      }
      
      setIsVisible(false);
    }, autoHideDelay);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [progress, duration, autoHideDelay, autoResume, onResume]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResume = () => {
    hasAutoResumedRef.current = true;
    onResume(progress);
    setIsVisible(false);
  };

  const handleRestart = () => {
    hasAutoResumedRef.current = true;
    onRestart();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={`resume-option ${!isVisible ? 'hidden' : ''}`}>
      <div className="resume-timer">
        {timeLeft}
      </div>
      
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
          Resume Now
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