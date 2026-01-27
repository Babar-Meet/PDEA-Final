import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer'
import VideoSidebar from '../../components/VideoSidebar/VideoSidebar'
import { ThumbsUp, ThumbsDown, Share2, Download, MoreVertical } from 'lucide-react'
import './Watch.css'

const Watch = ({ videos }) => {
  const { id } = useParams()
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Find video by id (which is now the relative path)
    const foundVideo = videos.find(v => v.id === id)
    if (foundVideo) {
      setVideo(foundVideo)
    }
    setLoading(false)
  }, [id, videos])

  if (loading) {
    return (
      <div className="watch__loading">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="watch__not-found">
        <h2>Video not found</h2>
        <p>The video might have been moved or deleted.</p>
      </div>
    )
  }

  // Format category display
  const categoryDisplay = video.category || 'Uncategorized'
  const folderPath = video.folder ? video.folder.split('/').filter(Boolean).join(' / ') : ''

  return (
    <div className="watch">
      <div className="watch__main">
        <div className="watch__player">
          <VideoPlayer video={video} />
        </div>
        
        <div className="watch__details">
          <h1 className="watch__title">{video.title}</h1>
          
          <div className="watch__meta">
            <div className="watch__stats">
              <span className="watch__views">{video.views} views</span>
              <span className="watch__date">{video.uploadDate}</span>
              {video.category && (
                <span className="watch__category">{categoryDisplay}</span>
              )}
            </div>
            
            {folderPath && (
              <div className="watch__folder">
                <span className="folder-label">Folder:</span>
                <span className="folder-path">{folderPath}</span>
              </div>
            )}
          </div>
          
          <div className="watch__actions">
            <div className="watch__left-actions">
              <button className="action-btn like-btn">
                <ThumbsUp size={20} />
                <span>{video.likes}</span>
              </button>
              
              <button className="action-btn">
                <ThumbsDown size={20} />
                <span>Dislike</span>
              </button>
              
              <button className="action-btn">
                <Share2 size={20} />
                <span>Share</span>
              </button>
              
              <button className="action-btn">
                <Download size={20} />
                <span>Save</span>
              </button>
            </div>
            
            <button className="action-btn menu-btn">
              <MoreVertical size={20} />
            </button>
          </div>
          
          <div className="watch__channel">
            <div className="channel__info">
              <img src={video.channelAvatar} alt={video.channel} className="channel__avatar" />
              <div className="channel__details">
                <h3 className="channel__name">{video.channel}</h3>
                <p className="channel__subs">1.5M subscribers</p>
              </div>
              <button className="channel__subscribe">Subscribe</button>
            </div>
            
            <div className="watch__description">
              <p>{video.filename} • {video.size} • {video.type}</p>
              {video.tags && video.tags.length > 0 && (
                <div className="watch__tags">
                  {video.tags.slice(0, 5).map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="watch__sidebar">
        <VideoSidebar videos={videos} currentVideoId={video.id} />
      </div>
    </div>
  )
}

export default Watch