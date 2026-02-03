import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../config';

const AmbienceContext = createContext();

export const useAmbience = () => useContext(AmbienceContext);

export const AmbienceProvider = ({ children }) => {
  const [activeSounds, setActiveSounds] = useState([]); // Array of { id, filename, title, volume, isPlaying, loop }
  const [masterVolume, setMasterVolume] = useState(0.8);
  const audioRefs = useRef({}); // id -> Audio object

  const toggleSound = (sound) => {
    const existing = activeSounds.find(s => s.id === sound.id);
    
    if (existing) {
      // Toggle existing
      const audio = audioRefs.current[sound.id];
      if (audio) {
        if (existing.isPlaying) {
          audio.pause();
        } else {
          audio.play().catch(e => console.error("Playback failed", e));
        }
      }
      setActiveSounds(prev => prev.map(s => s.id === sound.id ? { ...s, isPlaying: !s.isPlaying } : s));
    } else {
      // Add new
      const audio = new Audio(`${API_BASE_URL}${sound.path}`);
      audio.loop = true;
      audio.volume = masterVolume * 0.5;
      audio.play().catch(e => console.error("Playback failed", e));
      audioRefs.current[sound.id] = audio;
      setActiveSounds(prev => [...prev, { ...sound, volume: 0.5, isPlaying: true, loop: true }]);
    }
  };

  const removeSound = (id) => {
    setActiveSounds(prev => {
      const audio = audioRefs.current[id];
      if (audio) {
        audio.pause();
        audio.src = ""; // Clear memory/buffer
        delete audioRefs.current[id];
      }
      return prev.filter(s => s.id !== id);
    });
  };

  const setSoundVolume = (id, volume) => {
    setActiveSounds(prev => prev.map(s => {
      if (s.id === id) {
        if (audioRefs.current[id]) {
          audioRefs.current[id].volume = masterVolume * volume;
        }
        return { ...s, volume };
      }
      return s;
    }));
  };

  const setGlobalVolume = (volume) => {
    setMasterVolume(volume);
    activeSounds.forEach(s => {
      if (audioRefs.current[s.id]) {
        audioRefs.current[s.id].volume = volume * s.volume;
      }
    });
  };

  const stopAll = () => {
    Object.keys(audioRefs.current).forEach(id => {
      audioRefs.current[id].pause();
    });
    setActiveSounds(prev => prev.map(s => ({ ...s, isPlaying: false })));
  };

  const playAll = () => {
    activeSounds.forEach(s => {
      if (audioRefs.current[s.id]) {
        audioRefs.current[s.id].play().catch(e => console.error("Playback failed", e));
      }
    });
    setActiveSounds(prev => prev.map(s => ({ ...s, isPlaying: true })));
  };

  const clearQueue = () => {
    Object.keys(audioRefs.current).forEach(id => {
      audioRefs.current[id].pause();
      audioRefs.current[id].src = "";
    });
    audioRefs.current = {};
    setActiveSounds([]);
  };

  // Cleanup on unmount - important to stop all sounds
  useEffect(() => {
    return () => {
      Object.keys(audioRefs.current).forEach(id => {
        audioRefs.current[id].pause();
        audioRefs.current[id].src = "";
      });
    };
  }, []);

  return (
    <AmbienceContext.Provider value={{ 
      activeSounds, 
      masterVolume, 
      toggleSound, 
      removeSound, 
      setSoundVolume, 
      setGlobalVolume,
      stopAll,
      playAll,
      clearQueue
    }}>
      {children}
    </AmbienceContext.Provider>
  );
};
