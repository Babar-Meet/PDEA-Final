import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Play, MoreVertical, Folder, Trash2, Trash } from 'lucide-react'
import './VideoCard.css'
import { formatViews } from '../../utils/format'

const VideoCard = ({ video, compact = false, fetchVideos }) => {
  const {
    id,
    title,
    channel,
    channelAvatar,
    thumbnail,
    views,
    duration,
    uploadDate,
    size,
    filename,
    folder,
    category
  } = video

  const [showMenu, setShowMenu] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const menuRef = useRef(null)
  const buttonRef = useRef(null)

  // Check if thumbnail is local or external
  const isLocalThumbnail = thumbnail && thumbnail.startsWith('/thumbnails/')

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && 
          !menuRef.current.contains(event.target) && 
          buttonRef.current && 
          !buttonRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleMenuClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowMenu(!showMenu)
  }

  const handleMoveToTrash = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!window.confirm(`Move "${title}" to trash?`)) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`http://localhost:5000/api/videos/trash/${encodeURIComponent(video.relativePath || video.id)}`, {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert('Video moved to trash!')
        if (fetchVideos) fetchVideos()
      } else {
        alert('Failed to move video to trash: ' + data.error)
      }
    } catch (error) {
      console.error('Error moving to trash:', error)
      alert('Error moving video to trash')
    } finally {
      setIsDeleting(false)
      setShowMenu(false)
    }
  }

  const handlePermanentDelete = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!window.confirm(`Permanently delete "${title}"? This cannot be undone!`)) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`http://localhost:5000/api/videos/delete/${encodeURIComponent(video.relativePath || video.id)}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert('Video permanently deleted!')
        if (fetchVideos) fetchVideos()
      } else {
        alert('Failed to delete video: ' + data.error)
      }
    } catch (error) {
      console.error('Error deleting video:', error)
      alert('Error deleting video')
    } finally {
      setIsDeleting(false)
      setShowMenu(false)
    }
  }

  // Compact version (List view)
  if (compact) {
    return (
      <div className="video-card video-card--compact">
        <Link to={`/watch/${encodeURIComponent(id)}`} className="video-card__link">
          <div className="video-card__thumbnail">
            <img 
              src={thumbnail} 
              alt={title} 
              loading="lazy"
              className={isLocalThumbnail ? 'local-thumbnail' : ''}
            />
            {isLocalThumbnail && <div className="thumbnail-badge">🖼️</div>}
            
            <div className="video-card__overlay">
              <Play size={20} />
            </div>
            
            {/* Folder indicator */}
            {folder && (
              <div className="video-card__folder-badge">
                <Folder size={12} />
                <span>{folder.split('/').pop()}</span>
              </div>
            )}
          </div>
          
          <div className="video-card__info">
            <h3 className="video-card__title" title={title}>
              {title.length > 60 ? title.substring(0, 60) + '...' : title}
            </h3>
            
            <div className="video-card__meta">
              <span>{channel}</span>
              <span>•</span>
              <span>{formatViews(views)} views</span>
              <span>{uploadDate}</span>
            </div>
            
            <div className="video-card__file-info">
              <span>{duration}</span>
              <span>•</span>
              <span>{size}</span>
              
              {/* Show folder if exists */}
              {folder && (
                <>
                  <span>•</span>
                  <span className="folder-indicator" title={`Folder: ${folder}`}>
                    <Folder size={12} />
                    {folder.split('/').pop()}
                  </span>
                </>
              )}
            </div>
          </div>
        </Link>
        
        <div className="video-card__menu-wrapper">
          <button 
            ref={buttonRef}
            className="video-card__menu" 
            onClick={handleMenuClick}
          >
            <MoreVertical size={16} />
          </button>
          
          {showMenu && (
            <div ref={menuRef} className="video-card__dropdown">
              <button 
                className="dropdown-item trash-item"
                onClick={handleMoveToTrash}
                disabled={isDeleting}
              >
                <Trash2 size={14} />
                <span>Move to Trash</span>
              </button>
              <div className="dropdown-divider"></div>
              <button 
                className="dropdown-item delete-item"
                onClick={handlePermanentDelete}
                disabled={isDeleting}
              >
                <Trash size={14} />
                <span>Delete Permanently</span>
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Grid version
  return (
    <div className="video-card">
      <Link to={`/watch/${encodeURIComponent(id)}`} className="video-card__link">
        <div className="video-card__thumbnail">
          <img 
            src={thumbnail} 
            alt={title} 
            loading="lazy"
            className={isLocalThumbnail ? 'local-thumbnail' : ''}
          />
          {isLocalThumbnail && <div className="thumbnail-badge">🖼️</div>}
          
          {/* Folder indicator */}
          {folder && (
            <div className="video-card__folder-badge">
              <Folder size={14} />
              <span>{folder.split('/').pop()}</span>
            </div>
          )}
          
          <div className="video-card__overlay">
            <Play size={30} />
          </div>
        </div>
        
        <div className="video-card__content">
          <img src={channelAvatar} alt={channel} className="video-card__avatar" />
          
          <div className="video-card__details">
            <h3 className="video-card__title" title={title}>
              {title.length > 50 ? title.substring(0, 50) + '...' : title}
            </h3>
            
            <div className="video-card__channel">{channel}</div>
            
            <div className="video-card__stats">
              <span>{formatViews(views)} views</span>
              <span>{uploadDate}</span>
            </div>
            
            <div className="video-card__file-info">
              <span>{duration}</span>
              <span>•</span>
              <span>{size}</span>
              
              {/* Show folder if exists */}
              {folder && (
                <>
                  <span>•</span>
                  <span className="folder-indicator" title={`Folder: ${folder}`}>
                    <Folder size={12} />
                    {folder.split('/').pop()}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
      
      <div className="video-card__menu-wrapper">
        <button 
          ref={buttonRef}
          className="video-card__menu" 
          onClick={handleMenuClick}
        >
          <MoreVertical size={18} />
        </button>
        
        {showMenu && (
          <div ref={menuRef} className="video-card__dropdown">
            <button 
              className="dropdown-item trash-item"
              onClick={handleMoveToTrash}
              disabled={isDeleting}
            >
              <Trash2 size={14} />
              <span>Move to Trash</span>
            </button>
            <div className="dropdown-divider"></div>
            <button 
              className="dropdown-item delete-item"
              onClick={handlePermanentDelete}
              disabled={isDeleting}
            >
              <Trash size={14} />
              <span>Delete Permanently</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoCard