import React from 'react'
import { Wrench } from 'lucide-react'
import './advancedownload.css'

const AdvanceDownload = () => {
  return (
    <div className="advance-download-container">
      <div className="advance-download-maintenance">
        <Wrench size={48} className="maintenance-icon" />
        <h2>Under Maintenance</h2>
        <p>Advance Download will be available soon. This feature is currently being developed.</p>
        <p className="maintenance-hint">For now, please use Simple Download for your needs.</p>
      </div>
    </div>
  )
}

export default AdvanceDownload
