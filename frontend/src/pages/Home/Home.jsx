import React, { useState } from 'react'
import VideoGrid from '../../components/VideoGrid/VideoGrid'
import { Grid, List } from 'lucide-react'
import './Home.css'

const Home = ({ videos, loading }) => {
  const [viewMode, setViewMode] = useState('grid')
  const [category, setCategory] = useState('all')

  const categories = [
    'All', 'Music', 'Gaming', 'Live', 'Mixes', 'Programming',
    'Comedy', 'Recently uploaded', 'Watched', 'New to you',
    'Action', 'Drama', 'Documentary', 'Tutorials'
  ]

  return (
    <div className="home">
      {/* Categories Bar */}
      <div className="home__categories">
        <div className="categories__scroll">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-btn ${category === cat.toLowerCase() ? 'active' : ''}`}
              onClick={() => setCategory(cat.toLowerCase())}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* View Toggle */}
      <div className="home__header">
        <h2 className="home__title">Recommended</h2>
        <div className="view-toggle">
          <button
            className={`view-toggle__btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid view"
          >
            <Grid size={20} />
          </button>
          <button
            className={`view-toggle__btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List view"
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* Video Grid */}
      <VideoGrid videos={videos} loading={loading} viewMode={viewMode} />
    </div>
  )
}

export default Home