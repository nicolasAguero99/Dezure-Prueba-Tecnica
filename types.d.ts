import { type ROLE } from '@/constants/constants'

export interface Transcription {
  content: string
  role: 'user' | 'agent'
  start: number
  end: number
}

export interface AudioStore {
  audioTime: number | null
  currentAudioTime: number
  setAudioTime: (audioTime: number) => void
  setCurrentAudioTime: (currentAudioTime: number) => void
}

export interface RandomProfilePictureState {
  [ROLE.AGENT]: number
  [ROLE.USER]: number
}
