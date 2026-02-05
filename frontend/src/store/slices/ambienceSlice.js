import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeSounds: [],
  masterVolume: 0.8,
};

const ambienceSlice = createSlice({
  name: 'ambience',
  initialState,
  reducers: {
    toggleSound(state, action) {
      const sound = action.payload;
      const existing = state.activeSounds.find((s) => s.id === sound.id);

      if (existing) {
        const idx = state.activeSounds.findIndex((s) => s.id === sound.id);
        state.activeSounds[idx].isPlaying = !state.activeSounds[idx].isPlaying;
      } else {
        state.activeSounds.push({
          ...sound,
          volume: 0.5,
          isPlaying: true,
          loop: true,
        });
      }
    },
    removeSound(state, action) {
      const id = action.payload;
      state.activeSounds = state.activeSounds.filter((s) => s.id !== id);
    },
    setSoundVolume(state, action) {
      const { id, volume } = action.payload;
      const s = state.activeSounds.find((s) => s.id === id);
      if (s) s.volume = volume;
    },
    setMasterVolume(state, action) {
      state.masterVolume = action.payload;
    },
    stopAll(state) {
      state.activeSounds.forEach((s) => (s.isPlaying = false));
    },
    playAll(state) {
      state.activeSounds.forEach((s) => (s.isPlaying = true));
    },
    clearQueue(state) {
      state.activeSounds = [];
    },
  },
});

export const {
  toggleSound,
  removeSound,
  setSoundVolume,
  setMasterVolume,
  stopAll,
  playAll,
  clearQueue,
} = ambienceSlice.actions;

export default ambienceSlice.reducer;
