import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import VideoGrid from '../../components/VideoGrid/VideoGrid'
import { ArrowLeft, Folder, FolderOpen } from 'lucide-react'
import './CategoryPage.css'

const CategoryPage = ({ videos, categories }) => {
  const { categoryPath } = useParams()
  const navigate = useNavigate()
  const [categoryVideos, setCategoryVideos] = useState([])
  const [categoryInfo, setCategoryInfo] = useState(null)
  const [subcategories, setSubcategories] = useState([])

  useEffect(() => {
    if (!videos || !categoryPath) return

    // Decode category path
    const decodedPath = decodeURIComponent(categoryPath)
    
    // Filter videos for this category
    const filtered = videos.filter(video => {
      if (!video.folder) return false
      
      if (decodedPath === 'all') return true
      
      // Match exact folder or subfolder
      return video.folder === decodedPath || 
             video.folder.startsWith(decodedPath + '/')
    })
    
    setCategoryVideos(filtered)

    // Get category info
    if (decodedPath === 'all') {
      setCategoryInfo({
        name: 'All Videos',
        path: 'all',
        displayName: 'All Videos',
        count: videos.length
      })
    } else {
      const category = categories?.find(c => c.path === decodedPath)
      setCategoryInfo(category || {
        name: decodedPath.split('/').pop(),
        path: decodedPath,
        displayName: decodedPath.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        count: filtered.length
      })
    }

    // Get subcategories
    const subcatSet = new Set()
    filtered.forEach(video => {
      if (video.folder && video.folder !== decodedPath) {
        const relativePath = video.folder.substring(decodedPath.length + 1)
        const subcat = relativePath.split('/')[0]
        if (subcat) {
          subcatSet.add(subcat)
        }
      }
    })
    
    setSubcategories(Array.from(subcatSet).map(name => ({
      name,
      path: `${decodedPath}/${name}`,
      count: filtered.filter(v => v.folder === `${decodedPath}/${name}`).length
    })))

  }, [categoryPath, videos, categories])

  if (!categoryPath) {
    return (
      <div className="category-page">
        <div className="category-not-found">
          <h2>Category not specified</h2>
          <button onClick={() => navigate('/')}>Go Home</button>
        </div>
      </div>
    )
  }

  return (
    <div className="category-page">
      {/* Category Header */}
      <div className="category-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          Back
        </button>
        
        <div className="category-info">
          <div className="category-icon">
            <FolderOpen size={32} />
          </div>
          <div className="category-details">
            <h1 className="category-title">
              {categoryInfo?.displayName || 'Category'}
            </h1>
            <div className="category-stats">
              <span className="video-count">{categoryVideos.length} videos</span>
              <span className="category-path">{categoryInfo?.path}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subcategories */}
      {subcategories.length > 0 && (
        <div className="subcategories-section">
          <h3>Subfolders</h3>
          <div className="subcategories-grid">
            {subcategories.map(subcat => (
              <a
                key={subcat.path}
                href={`/category/${encodeURIComponent(subcat.path)}`}
                className="subcategory-card"
              >
                <Folder size={20} />
                <div className="subcategory-info">
                  <span className="subcategory-name">{subcat.name}</span>
                  <span className="subcategory-count">{subcat.count} videos</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Videos */}
      <div className="category-videos">
        <h3>Videos ({categoryVideos.length})</h3>
        {categoryVideos.length > 0 ? (
          <VideoGrid videos={categoryVideos} viewMode="grid" />
        ) : (
          <div className="no-videos">
            <Folder size={48} />
            <p>No videos found in this category</p>
            <button onClick={() => navigate('/')}>Browse All Videos</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryPage