import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import { useAmbience } from '../../Context/AmbienceContext';
import { 
  Music, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Trash2, 
  Wind, 
  Droplets, 
  CloudRain, 
  Flame, 
  Coffee,
  Volume1,
  Maximize2
} from 'lucide-react';
import './Ambience.css';

const Ambience = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { 
    activeSounds, 
    masterVolume, 
    toggleSound, 
    removeSound, 
    setSoundVolume, 
    setGlobalVolume,
    stopAll,
    playAll,
    clearQueue
  } = useAmbience();

  useEffect(() => {
    const fetchAmbience = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/ambience/files`);
        const data = await res.json();
        if (data.success) {
          setFiles(data.files);
        }
      } catch (err) {
        console.error("Failed to fetch ambience files", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAmbience();
  }, []);

  const getIntensityIcon = (id) => {
    const title = id.toLowerCase();
    if (title.includes('rain')) return <CloudRain size={24} />;
    if (title.includes('water') || title.includes('stream')) return <Droplets size={24} />;
    if (title.includes('wind')) return <Wind size={24} />;
    if (title.includes('fire')) return <Flame size={24} />;
    if (title.includes('cafe')) return <Coffee size={24} />;
    return <Music size={24} />;
  };

  return (
    <div className="ambience-container">
      <div className="ambience-header">
        <div className="header-text">
          <h1>Ambience Mixer</h1>
          <p>Layer background sounds to create your perfect environment.</p>
        </div>
        
        <div className="master-controls">
          <div className="master-volume-wrapper">
            {masterVolume === 0 ? <VolumeX size={20} /> : masterVolume < 0.5 ? <Volume1 size={20} /> : <Volume2 size={20} />}
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={masterVolume} 
              onChange={(e) => setGlobalVolume(parseFloat(e.target.value))}
              className="master-volume-slider"
            />
          </div>
          <div className="master-actions">
            <button onClick={playAll} className="action-btn">Play All</button>
            <button onClick={stopAll} className="action-btn">Pause All</button>
            <button onClick={clearQueue} className="action-btn danger">Clear</button>
          </div>
        </div>
      </div>

      <div className="ambience-layout">
        <section className="ambience-library">
          <h2>Library</h2>
          {loading ? (
            <div className="loading">Loading sounds...</div>
          ) : (
            <div className="sounds-grid">
              {files.map(file => {
                const isActive = activeSounds.find(s => s.id === file.id);
                return (
                  <div 
                    key={file.id} 
                    className={`sound-card ${isActive ? 'active' : ''}`}
                    onClick={() => toggleSound(file)}
                  >
                    <div className="sound-card-thumb">
                      {file.thumbnail ? (
                        <img src={`${API_BASE_URL}${file.thumbnail}`} alt={file.title} />
                      ) : (
                        <div className="thumb-placeholder">
                          {getIntensityIcon(file.id)}
                        </div>
                      )}
                      {isActive?.isPlaying && (
                        <div className="playing-indicator">
                          <span></span><span></span><span></span>
                        </div>
                      )}
                    </div>
                    <div className="sound-card-info">
                      <span className="sound-title">{file.title}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="ambience-queue">
          <h2>Active Mix</h2>
          {activeSounds.length === 0 ? (
            <div className="empty-queue">
              <Music size={48} />
              <p>No sounds active. Select from the library to start mixing.</p>
            </div>
          ) : (
            <div className="active-sounds-list">
              {activeSounds.map(sound => (
                <div key={sound.id} className="active-sound-item">
                  <div className="item-main">
                    <div className="item-icon">
                      {getIntensityIcon(sound.id)}
                    </div>
                    <div className="item-info">
                      <span className="item-title">{sound.title}</span>
                      <div className="item-controls">
                        <button onClick={() => toggleSound(sound)} className="item-play-btn">
                          {sound.isPlaying ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                        <div className="item-volume">
                          <Volume1 size={14} />
                          <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.01" 
                            value={sound.volume} 
                            onChange={(e) => setSoundVolume(sound.id, parseFloat(e.target.value))}
                            className="item-volume-slider"
                          />
                        </div>
                      </div>
                    </div>
                    <button onClick={() => removeSound(sound.id)} className="item-remove-btn">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Ambience;
