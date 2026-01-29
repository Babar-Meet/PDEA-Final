import React, { useState } from 'react'
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { 
  Video,
  ListVideo,
  List,
  Download as DownloadIcon,
  BarChart3,
  FileText,
  Settings,
  Clock,
  Zap,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import './Download.css'

// Import components
import SingleVideo from './components/SingleVideo/SingleVideo'
import BatchDownload from './components/BatchDownload/BatchDownload'
import PlaylistDownload from './components/PlaylistDownload/PlaylistDownload'
import DownloadQueue from './components/DownloadQueue/DownloadQueue'
import ProgressPage from './components/ProgressPage/ProgressPage'
import LogPage from './components/LogPage/LogPage'
import DownloadSettings from './components/DownloadSettings/DownloadSettings'

const Download = () => {
  const location = useLocation()
  const currentPath = location.pathname

  const navItems = [
    { path: '/download/single', label: 'Single Video', icon: <Video size={20} /> },
    { path: '/download/batch', label: 'Batch Download', icon: <ListVideo size={20} /> },
    { path: '/download/playlist', label: 'Playlist', icon: <List size={20} /> },
    { path: '/download/queue', label: 'Download Queue', icon: <DownloadIcon size={20} /> },
    { path: '/download/progress', label: 'Progress', icon: <BarChart3 size={20} /> },
    { path: '/download/logs', label: 'Logs', icon: <FileText size={20} /> },
    { path: '/download/settings', label: 'Settings', icon: <Settings size={20} /> }
  ]

  return (
    <div className="download-page">
      <div className="download-header">
        <div className="header-content">
          <div className="header-icon">
            <DownloadIcon size={32} />
          </div>
          <div>
            <h1 className="download-title">Download Manager</h1>
            <p className="download-subtitle">Manage and monitor your downloads</p>
          </div>
        </div>
      </div>

      <div className="download-container">
        <div className="download-sidebar">
          <nav className="download-nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`download-nav-item ${currentPath === item.path ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="download-content">
          <Routes>
            <Route index element={<Navigate to="/download/single" replace />} />
            <Route path="single" element={<SingleVideo />} />
            <Route path="batch" element={<BatchDownload />} />
            <Route path="playlist" element={<PlaylistDownload />} />
            <Route path="queue" element={<DownloadQueue />} />
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