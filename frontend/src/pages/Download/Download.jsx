import React, { useState } from 'react'
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { 
  Download as DownloadIcon, 
  Settings, 
  List, 
  Clock, 
  FileText, 
  Zap, 
  AlertCircle,
  BarChart3,
  PlayCircle,
  CheckCircle,
  Youtube,
  Music,
  Video,
  Folder,
  Home,
  Users,
  FileVideo,
  History,
  Database,
  DownloadCloud
} from 'lucide-react'
import './Download.css'

// Sub-page components
const SimpleDownload = () => (
  <div className="download-subpage">
    <div className="page-header">
      <h2><Video size={28} /> Single Video Download</h2>
      <p className="page-subtitle">Download individual videos with custom quality options</p>
    </div>
    
    <div className="page-content">
      <div className="card input-card">
        <div className="card-header">
          <div className="card-icon">
            <Youtube size={24} />
          </div>
          <h3>Enter YouTube URL</h3>
        </div>
        <input 
          type="text" 
          className="url-input" 
          placeholder="https://www.youtube.com/watch?v=..."
        />
        <div className="button-group">
          <button className="btn btn-primary">
            <DownloadIcon size={18} />
            Get Video Info
          </button>
          <button className="btn btn-secondary" disabled>
            <FileVideo size={18} />
            Add to Queue
          </button>
        </div>
      </div>

      <div className="content-row">
        <div className="card video-info-card">
          <div className="card-header">
            <h3>Video Information</h3>
          </div>
          <div className="thumbnail-placeholder">
            <Youtube size={48} />
            <p>Thumbnail will appear here</p>
          </div>
          <div className="video-details">
            <div className="detail-item">
              <span className="detail-label">Title:</span>
              <span className="detail-value">Waiting for video info...</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Duration:</span>
              <span className="detail-value">--:--</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Quality:</span>
              <span className="detail-value">Not selected</span>
            </div>
          </div>
        </div>

        <div className="card options-card">
          <div className="card-header">
            <h3>Download Options</h3>
          </div>
          <div className="option-group">
            <label className="option-label">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Audio only (best quality)
            </label>
          </div>
          <div className="option-group">
            <label className="option-label">Quality:</label>
            <select className="quality-select" disabled>
              <option>Select quality after getting video info</option>
            </select>
          </div>
          <div className="option-group">
            <label className="option-label">Format:</label>
            <select className="format-select">
              <option>mp4 (Video + Audio)</option>
              <option>mp3 (Audio only)</option>
              <option>webm (VP9)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const BatchDownload = () => (
  <div className="download-subpage">
    <div className="page-header">
      <h2><Users size={28} /> Batch Download</h2>
      <p className="page-subtitle">Download multiple videos from multiple URLs</p>
    </div>
    
    <div className="page-content">
      <div className="card input-card">
        <div className="card-header">
          <div className="card-icon">
            <List size={24} />
          </div>
          <h3>Enter YouTube URLs</h3>
        </div>
        <textarea 
          className="batch-textarea" 
          placeholder="Enter URLs (one per line or separated by commas, semicolons, or spaces)"
          rows={8}
        />
        <div className="button-group">
          <button className="btn btn-primary">
            <DownloadIcon size={18} />
            Process URLs
          </button>
          <button className="btn btn-secondary">
            <Folder size={18} />
            Add All to Queue
          </button>
        </div>
      </div>

      <div className="card status-card">
        <div className="card-header">
          <h3>Processing Status</h3>
        </div>
        <div className="status-content">
          <div className="status-indicator">
            <div className="status-icon">
              <Clock size={24} />
            </div>
            <div className="status-text">
              <p className="status-title">Ready to process</p>
              <p className="status-description">Enter URLs and click "Process URLs"</p>
            </div>
          </div>
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '0%' }}></div>
            </div>
            <span className="progress-text">0%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const PlaylistDownload = () => (
  <div className="download-subpage">
    <div className="page-header">
      <h2><List size={28} /> Playlist Download</h2>
      <p className="page-subtitle">Download entire playlists or selected videos</p>
    </div>
    
    <div className="page-content">
      <div className="content-row">
        <div className="card playlist-input-card">
          <div className="card-header">
            <div className="card-icon">
              <Youtube size={24} />
            </div>
            <h3>Playlist Information</h3>
          </div>
          <input 
            type="text" 
            className="url-input" 
            placeholder="https://www.youtube.com/playlist?list=..."
          />
          
          <div className="playlist-actions">
            <button className="btn btn-primary">
              <DownloadIcon size={18} />
              Get Playlist Info
            </button>
          </div>

          <div className="playlist-stats">
            <div className="stat-item">
              <span className="stat-label">Videos in playlist:</span>
              <span className="stat-value">0</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Selected videos:</span>
              <span className="stat-value">0</span>
            </div>
          </div>

          <div className="selection-input">
            <label className="option-label">Select videos:</label>
            <input 
              type="text" 
              className="selection-text" 
              placeholder="e.g., 1-10, 15, 20-25 or 'all' for entire playlist"
            />
          </div>
        </div>

        <div className="card playlist-controls-card">
          <div className="card-header">
            <h3>Controls</h3>
          </div>
          <div className="control-buttons">
            <button className="btn btn-primary" disabled>
              <DownloadIcon size={18} />
              Add Selected to Queue
            </button>
            <button className="btn btn-secondary">
              <History size={18} />
              Clear Selection
            </button>
          </div>

          <div className="progress-display">
            <div className="progress-info">
              <span className="progress-label">Processing:</span>
              <span className="progress-value">0/0 videos</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '0%' }}></div>
            </div>
          </div>

          <div className="size-estimate">
            <div className="size-info">
              <span className="size-label">Estimated total size:</span>
              <span className="size-value">0 MB</span>
            </div>
            <div className="size-info">
              <span className="size-label">Estimated time:</span>
              <span className="size-value">0 min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const CurrentlyQueue = () => (
  <div className="download-subpage">
    <div className="page-header">
      <h2><List size={28} /> Download Queue</h2>
      <p className="page-subtitle">Manage and monitor your download queue</p>
    </div>
    
    <div className="page-content">
      <div className="queue-controls">
        <div className="button-group">
          <button className="btn btn-primary">
            <PlayCircle size={18} />
            Start Download
          </button>
          <button className="btn btn-secondary">
            <AlertCircle size={18} />
            Clear Queue
          </button>
          <button className="btn btn-danger">
            <AlertCircle size={18} />
            Remove Selected
          </button>
        </div>
        <div className="queue-stats">
          <div className="stat-item">
            <span className="stat-label">Queue:</span>
            <span className="stat-value">0 items</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total size:</span>
            <span className="stat-value">0 MB</span>
          </div>
        </div>
      </div>

      <div className="queue-list">
        <div className="queue-item">
          <div className="queue-item-thumbnail">
            <Video size={40} />
          </div>
          <div className="queue-item-content">
            <div className="queue-item-title">Your download queue is empty</div>
            <div className="queue-item-subtitle">Add videos from Simple, Batch, or Playlist download pages</div>
          </div>
          <div className="queue-item-status">
            <span className="status-badge status-idle">Idle</span>
          </div>
        </div>
      </div>

      <div className="card queue-info-card">
        <div className="card-header">
          <h3>Queue Information</h3>
        </div>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Active Downloads:</span>
            <span className="info-value">0</span>
          </div>
          <div className="info-item">
            <span className="info-label">Queued:</span>
            <span className="info-value">0</span>
          </div>
          <div className="info-item">
            <span className="info-label">Completed:</span>
            <span className="info-value">0</span>
          </div>
          <div className="info-item">
            <span className="info-label">Failed:</span>
            <span className="info-value">0</span>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const ProgressPage = () => (
  <div className="download-subpage">
    <div className="page-header">
      <h2><BarChart3 size={28} /> Download Progress</h2>
      <p className="page-subtitle">Monitor current downloads and statistics</p>
    </div>
    
    <div className="page-content">
      <div className="card progress-card">
        <div className="card-header">
          <h3>Current Download</h3>
        </div>
        <div className="current-download">
          <div className="download-thumbnail">
            <Video size={60} />
          </div>
          <div className="download-info">
            <h4 className="download-title">No active download</h4>
            <p className="download-url">Add videos to queue and start downloading</p>
            
            <div className="progress-container large">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '0%' }}></div>
              </div>
              <span className="progress-text">0%</span>
            </div>

            <div className="download-details">
              <div className="detail-item">
                <span className="detail-label">Status:</span>
                <span className="detail-value status-idle">Idle</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Speed:</span>
                <span className="detail-value">0 MB/s</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">ETA:</span>
                <span className="detail-value">--:--</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Size:</span>
                <span className="detail-value">0 MB / 0 MB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-icon">
            <DownloadCloud size={24} />
          </div>
          <h3>Total Downloads</h3>
          <p className="stat-number">15</p>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">
            <CheckCircle size={24} />
          </div>
          <h3>Success Rate</h3>
          <p className="stat-number">93%</p>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">
            <BarChart3 size={24} />
          </div>
          <h3>Average Speed</h3>
          <p className="stat-number">2.4 MB/s</p>
        </div>
        <div className="card stat-card">
          <div className="stat-icon">
            <Clock size={24} />
          </div>
          <h3>Total Time</h3>
          <p className="stat-number">4.2 hrs</p>
        </div>
      </div>
    </div>
  </div>
)

const LogPage = () => (
  <div className="download-subpage">
    <div className="page-header">
      <h2><FileText size={28} /> Download Logs</h2>
      <p className="page-subtitle">View download history and activity logs</p>
    </div>
    
    <div className="page-content">
      <div className="log-controls">
        <div className="button-group">
          <button className="btn btn-primary">
            <Database size={18} />
            Refresh Logs
          </button>
          <button className="btn btn-secondary">
            <FileText size={18} />
            Clear Logs
          </button>
          <button className="btn btn-secondary">
            <Folder size={18} />
            Export Logs
          </button>
        </div>
        <div className="log-filters">
          <select className="filter-select">
            <option>All Entries</option>
            <option>Success Only</option>
            <option>Errors Only</option>
            <option>Today</option>
            <option>Last 7 Days</option>
          </select>
        </div>
      </div>

      <div className="log-entries">
        <div className="log-entry success">
          <div className="log-icon">
            <CheckCircle size={16} />
          </div>
          <div className="log-content">
            <div className="log-message">Video "Tutorial.mp4" downloaded successfully</div>
            <div className="log-time">2 hours ago</div>
          </div>
        </div>
        <div className="log-entry success">
          <div className="log-icon">
            <CheckCircle size={16} />
          </div>
          <div className="log-content">
            <div className="log-message">Playlist "Music Videos" completed (15 videos)</div>
            <div className="log-time">5 hours ago</div>
          </div>
        </div>
        <div className="log-entry error">
          <div className="log-icon">
            <AlertCircle size={16} />
          </div>
          <div className="log-content">
            <div className="log-message">Failed to download "Conference Recording" - Network error</div>
            <div className="log-time">1 day ago</div>
          </div>
        </div>
        <div className="log-entry info">
          <div className="log-icon">
            <DownloadIcon size={16} />
          </div>
          <div className="log-content">
            <div className="log-message">Download session started</div>
            <div className="log-time">1 day ago</div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const DownloadSettings = () => (
  <div className="download-subpage">
    <div className="page-header">
      <h2><Settings size={28} /> Download Settings</h2>
      <p className="page-subtitle">Configure download preferences and options</p>
    </div>
    
    <div className="page-content">
      <div className="settings-grid">
        <div className="card settings-card">
          <div className="card-header">
            <h3>Download Location</h3>
          </div>
          <div className="setting-item">
            <label className="setting-label">Download Directory</label>
            <div className="directory-input">
              <input type="text" value="C:\Users\Downloads\" readOnly />
              <button className="btn btn-secondary">
                <Folder size={16} />
                Browse
              </button>
            </div>
          </div>
          <div className="setting-item">
            <label className="setting-label">
              <input type="checkbox" defaultChecked />
              Create subfolders by date
            </label>
          </div>
          <div className="setting-item">
            <label className="setting-label">
              <input type="checkbox" />
              Ask for location each time
            </label>
          </div>
        </div>

        <div className="card settings-card">
          <div className="card-header">
            <h3>Quality Settings</h3>
          </div>
          <div className="setting-item">
            <label className="setting-label">Default Video Quality</label>
            <select className="setting-select">
              <option>Best available</option>
              <option>1080p</option>
              <option>720p</option>
              <option>480p</option>
              <option>360p</option>
            </select>
          </div>
          <div className="setting-item">
            <label className="setting-label">Default Audio Quality</label>
            <select className="setting-select">
              <option>Best available</option>
              <option>320kbps</option>
              <option>256kbps</option>
              <option>192kbps</option>
              <option>128kbps</option>
            </select>
          </div>
          <div className="setting-item">
            <label className="setting-label">
              <input type="checkbox" defaultChecked />
              Prefer H.264 over VP9
            </label>
          </div>
        </div>

        <div className="card settings-card">
          <div className="card-header">
            <h3>Connection Settings</h3>
          </div>
          <div className="setting-item">
            <label className="setting-label">Simultaneous Downloads</label>
            <select className="setting-select">
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>
          </div>
          <div className="setting-item">
            <label className="setting-label">Retry Failed Downloads</label>
            <select className="setting-select">
              <option>0 (No retry)</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>
          </div>
          <div className="setting-item">
            <label className="setting-label">Cookies File Path</label>
            <div className="directory-input">
              <input type="text" placeholder="Path to cookies.txt" />
              <button className="btn btn-secondary">
                <Folder size={16} />
                Browse
              </button>
            </div>
          </div>
        </div>

        <div className="card settings-card">
          <div className="card-header">
            <h3>Advanced Settings</h3>
          </div>
          <div className="setting-item">
            <label className="setting-label">Custom yt-dlp Arguments</label>
            <input type="text" placeholder="--extractor-args ..." />
          </div>
          <div className="setting-item">
            <label className="setting-label">FFmpeg Location</label>
            <div className="directory-input">
              <input type="text" placeholder="Auto-detect" />
              <button className="btn btn-secondary">
                <Folder size={16} />
                Browse
              </button>
            </div>
          </div>
          <div className="setting-item">
            <label className="setting-label">
              <input type="checkbox" defaultChecked />
              Keep original files after merging
            </label>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn btn-primary">
          <CheckCircle size={18} />
          Save Settings
        </button>
        <button className="btn btn-secondary">
          <History size={18} />
          Reset to Defaults
        </button>
      </div>
    </div>
  </div>
)

const Download = () => {
  const location = useLocation()
  const currentPath = location.pathname

  const navItems = [
    { path: '/download/simple', label: 'Simple Download', icon: <Video size={20} /> },
    { path: '/download/batch', label: 'Batch Download', icon: <Users size={20} /> },
    { path: '/download/playlist', label: 'Playlist', icon: <List size={20} /> },
    { path: '/download/queue', label: 'Queue', icon: <Clock size={20} /> },
    { path: '/download/progress', label: 'Progress', icon: <BarChart3 size={20} /> },
    { path: '/download/logs', label: 'Logs', icon: <FileText size={20} /> },
    { path: '/download/settings', label: 'Settings', icon: <Settings size={20} /> }
  ]

  return (
    <div className="download-page">
      <div className="download-header">
        <div className="header-left">
          <div className="header-icon">
            <DownloadIcon size={32} />
          </div>
          <div className="header-title">
            <h1>YouTube Downloader</h1>
            <p className="header-subtitle">Download and manage your videos</p>
          </div>
        </div>
        
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-label">Queue:</span>
            <span className="stat-value">0 items</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Size:</span>
            <span className="stat-value">0 MB</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Time:</span>
            <span className="stat-value">0 min</span>
          </div>
        </div>
      </div>

      <div className="download-container">
        <div className="download-sidebar">
          <div className="sidebar-header">
            <h3>Navigation</h3>
          </div>
          <nav className="download-nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`download-nav-item ${currentPath === item.path ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {currentPath === item.path && <div className="nav-indicator"></div>}
              </Link>
            ))}
          </nav>
          
          <div className="sidebar-footer">
            <div className="version-info">
              <span>Version 1.0.0</span>
            </div>
          </div>
        </div>

        <div className="download-content">
          <Routes>
            <Route index element={<Navigate to="/download/simple" replace />} />
            <Route path="simple" element={<SimpleDownload />} />
            <Route path="batch" element={<BatchDownload />} />
            <Route path="playlist" element={<PlaylistDownload />} />
            <Route path="queue" element={<CurrentlyQueue />} />
            <Route path="progress" element={<ProgressPage />} />
            <Route path="logs" element={<LogPage />} />
            <Route path="settings" element={<DownloadSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default Download