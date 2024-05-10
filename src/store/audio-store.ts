import { createWithEqualityFn } from 'zustand/traditional'

// Types
import { type AudioStore } from '../../types'

export const useAudioStore = createWithEqualityFn<AudioStore>((set) => ({
  audioTime: null,
  currentAudioTime: 0,
  setAudioTime: (audioTime) => { set({ audioTime }) },
  setCurrentAudioTime: (currentAudioTime) => { set({ currentAudioTime }) }
}))
