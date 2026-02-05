import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../../config';

/**
 * Syncs Redux ambience state to actual Audio objects.
 * Handles Audio lifecycle (create, play, pause, volume, cleanup) based on Redux state.
 */
const AmbienceSync = () => {
  const { activeSounds, masterVolume } = useSelector((state) => state.ambience);
  const audioRefs = useRef({});

  useEffect(() => {
    const refs = audioRefs.current;

    activeSounds.forEach((sound) => {
      if (!refs[sound.id]) {
        const audio = new Audio(`${API_BASE_URL}${sound.path}`);
        audio.loop = true;
        audio.volume = masterVolume * (sound.volume ?? 0.5);
        if (sound.isPlaying) {
          audio.play().catch((e) => console.error('Playback failed', e));
        }
        refs[sound.id] = audio;
      } else {
        const audio = refs[sound.id];
        audio.volume = masterVolume * (sound.volume ?? 0.5);
        if (sound.isPlaying) {
          audio.play().catch((e) => console.error('Playback failed', e));
        } else {
          audio.pause();
        }
      }
    });

    Object.keys(refs).forEach((id) => {
      if (!activeSounds.find((s) => s.id === id)) {
        const audio = refs[id];
        if (audio) {
          audio.pause();
          audio.src = '';
          delete refs[id];
        }
      }
    });
  }, [activeSounds, masterVolume]);

  useEffect(() => {
    return () => {
      Object.keys(audioRefs.current).forEach((id) => {
        const audio = audioRefs.current[id];
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
      audioRefs.current = {};
    };
  }, []);

  return null;
};

export default AmbienceSync;
