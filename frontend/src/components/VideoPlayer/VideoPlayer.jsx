import React, { useRef, useState, useEffect } from 'react'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Settings
} from 'lucide-react'
import './VideoPlayer.css'

const VideoPlayer = ({ video }) => {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [playbackRate, setPlaybackRate] = useState(1)
  
  // Refs for spacebar hold functionality
  const spacebarHoldTimerRef = useRef(null)
  const spacebarPressedRef = useRef(false)
  const originalPlaybackRateRef = useRef(1)
  const isTempSpeedActiveRef = useRef(false)

  useEffect(() => {
    const videoElement = videoRef.current
    
    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration)
    }
    
    const handleEnded = () => {
      setIsPlaying(false)
    }
    
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata)
    videoElement.addEventListener('ended', handleEnded)
    
    return () => {
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata)
      videoElement.removeEventListener('ended', handleEnded)
    }
  }, [])

  // Keyboard shortcuts - global event listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Skip if user is typing in input or textarea
      const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA'
      if (isInput) return

      const key = e.key.toLowerCase()
      
      // Spacebar - handle hold for 2x speed
      if (key === ' ' || key === 'spacebar') {
        e.preventDefault()
        e.stopPropagation()
        
        if (spacebarPressedRef.current) return
        
        spacebarPressedRef.current = true
        
        // Start timer for hold detection (1 second)
        spacebarHoldTimerRef.current = setTimeout(() => {
          if (spacebarPressedRef.current && videoRef.current) {
            activateTempSpeed()
          }
        }, 1000) // 1 second
        return
      }

      switch(key) {
        // Play/Pause
        case 'k':
          e.preventDefault()
          togglePlay()
          break
          
        case 'arrowleft':
          e.preventDefault()
          skip(-5)
          break
          
        case 'arrowright':
          e.preventDefault()
          skip(5)
          break
          
        case 'arrowup':
          e.preventDefault()
          changeVolume(volume + 0.1)
          break
          
        case 'arrowdown':
          e.preventDefault()
          changeVolume(volume - 0.1)
          break
          
        case 'm':
          e.preventDefault()
          toggleMute()
          break
          
        // Frame navigation
        case ',':
          e.preventDefault()
          if (videoRef.current) {
            if (isPlaying) {
              videoRef.current.pause()
              setIsPlaying(false)
            }
            previousFrame()
          }
          break
          
        case '.':
          e.preventDefault()
          if (videoRef.current) {
            if (isPlaying) {
              videoRef.current.pause()
              setIsPlaying(false)
            }
            nextFrame()
          }
          break
          
        // Playback speed decrease
        case '[':
        case '<':
          e.preventDefault()
          decreasePlaybackRate()
          break
          
        // Playback speed increase
        case ']':
        case '>':
          e.preventDefault()
          increasePlaybackRate()
          break
          
        // Fullscreen
        case 'f':
          e.preventDefault()
          toggleFullscreen()
          break
      }
    }

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase()
      
      if (key === ' ' || key === 'spacebar') {
        e.preventDefault()
        e.stopPropagation()
        
        // Clear the hold timer
        if (spacebarHoldTimerRef.current) {
          clearTimeout(spacebarHoldTimerRef.current)
          spacebarHoldTimerRef.current = null
        }
        
        // If temporary speed was active, deactivate it
        if (isTempSpeedActiveRef.current) {
          deactivateTempSpeed()
        } else if (spacebarPressedRef.current) {
          // If spacebar was pressed briefly, toggle play/pause
          togglePlay()
        }
        
        spacebarPressedRef.current = false
      }
    }

    // Use capture phase and passive: false for better control
    document.addEventListener('keydown', handleKeyDown, { capture: true })
    document.addEventListener('keyup', handleKeyUp, { capture: true })

    return () => {
      document.removeEventListener('keydown', handleKeyDown, { capture: true })
      document.removeEventListener('keyup', handleKeyUp, { capture: true })
      
      if (spacebarHoldTimerRef.current) {
        clearTimeout(spacebarHoldTimerRef.current)
      }
    }
  }, [volume, playbackRate, showControls, isFullscreen, isPlaying])

  useEffect(() => {
    let timeoutId
    if (showControls && isPlaying) {
      timeoutId = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }
    return () => clearTimeout(timeoutId)
  }, [showControls, isPlaying])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime)
  }

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value)
    setCurrentTime(newTime)
    if (videoRef.current) {
      videoRef.current.currentTime = newTime
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
      videoRef.current.muted = newVolume === 0
    }
  }

  const changeVolume = (newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    setVolume(clampedVolume)
    setIsMuted(clampedVolume === 0)
    if (videoRef.current) {
      videoRef.current.volume = clampedVolume
      videoRef.current.muted = clampedVolume === 0
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
      if (!isMuted) {
        setVolume(0)
      } else {
        setVolume(1)
      }
    }
  }

  const toggleFullscreen = () => {
    const elem = videoRef.current.parentElement
    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen()
        setIsFullscreen(true)
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  const skip = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds
    }
  }

  // Frame-by-frame navigation (assuming 30fps)
  const previousFrame = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - (1/30))
    }
  }

  const nextFrame = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += (1/30)
    }
  }

  // Playback rate controls
  const decreasePlaybackRate = () => {
    const newRate = Math.max(0.25, playbackRate - 0.25)
    setPlaybackRate(newRate)
    if (videoRef.current && !isTempSpeedActiveRef.current) {
      videoRef.current.playbackRate = newRate
    }
  }

  const increasePlaybackRate = () => {
    const newRate = Math.min(4, playbackRate + 0.25)
    setPlaybackRate(newRate)
    if (videoRef.current && !isTempSpeedActiveRef.current) {
      videoRef.current.playbackRate = newRate
    }
  }

  // Temporary 2x speed on spacebar hold
  const activateTempSpeed = () => {
    if (!videoRef.current) return
    
    if (!isTempSpeedActiveRef.current) {
      originalPlaybackRateRef.current = videoRef.current.playbackRate
    }
    
    videoRef.current.playbackRate = 2
    isTempSpeedActiveRef.current = true
  }

  const deactivateTempSpeed = () => {
    if (!videoRef.current || !isTempSpeedActiveRef.current) return
    
    videoRef.current.playbackRate = originalPlaybackRateRef.current
    isTempSpeedActiveRef.current = false
  }

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleMouseMove = () => {
    setShowControls(true)
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div 
      className="video-player" 
      onMouseMove={handleMouseMove}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        className="video-player__element"
        src={`http://localhost:5000${video.url}`}
        onTimeUpdate={handleTimeUpdate}
      />
      
      <div className={`video-player__controls ${showControls ? 'visible' : ''}`}>
        <div className="video-player__progress">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="progress-slider"
            style={{ '--progress': `${progress}%` }}
          />
        </div>

        <div className="video-player__controls-bottom">
          <div className="video-player__left-controls">
            <button className="control-btn" onClick={togglePlay}>
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            
            <button className="control-btn" onClick={() => skip(-10)}>
              <SkipBack size={20} />
            </button>
            
            <button className="control-btn" onClick={() => skip(10)}>
              <SkipForward size={20} />            </button>

            <div className="volume-control">
              <button className="control-btn" onClick={toggleMute}>
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
            </div>

            <div className="time-display">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="video-player__right-controls">
            <button className="control-btn">
              <Settings size={20} />
            </button>
            
            <button className="control-btn" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer