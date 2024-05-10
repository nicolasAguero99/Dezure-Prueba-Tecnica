'use client'

import { useEffect, useState } from 'react'
import { shallow } from 'zustand/shallow'

// Types
import { type RandomProfilePictureState, type Transcription } from '../../types'

// Data
import transcriptionJson from '@/data/transcription.json'

// Store
import { useAudioStore } from '@/store/audio-store'

// Utils
import { formatTime } from '@/utils/utils'

// Constants
import { ROLE } from '@/constants/constants'

export default function TranscriptionList (): JSX.Element {
  const [transcriptionList, setTranscriptionList] = useState<Transcription[]>([])
  const [randomProfilePicture, setRandomPicture] = useState<RandomProfilePictureState>({
    [ROLE.AGENT]: 1,
    [ROLE.USER]: 1
  }) // Made this way to be scalable in the future with other role names

  const { currentAudioTime } = useAudioStore((state) => ({
    currentAudioTime: state.currentAudioTime
  }), shallow)

  const { setAudioTime } = useAudioStore()

  useEffect(() => {
    const randomAgentPicture = Math.floor(Math.random() * 3) + 1
    const randomUserPicture = Math.floor(Math.random() * 3) + 1
    setRandomPicture({
      [ROLE.AGENT]: randomAgentPicture,
      [ROLE.USER]: randomUserPicture
    })
    transcriptionJson != null && setTranscriptionList(transcriptionJson as Transcription[])
  }, [])

  const handleGoTime = (time: Transcription['start']): void => {
    setAudioTime(time)
  }

  return (
    <section className='flex flex-col gap-8 min-[600px]:px-8 max-[600px]:mx-6 py-14 max-w-[750px] m-auto'>
      {
        transcriptionList.length > 0 && transcriptionList.map(transcription => {
          const { content: text, role, start, end } = transcription
          const timeStartFormatted = formatTime(start)
          const timeEndFormatted = formatTime(end)
          const isCurrentTime = currentAudioTime >= transcription.start && currentAudioTime <= transcription.end
          const isAgent = role === ROLE.AGENT
          return (
            <div key={start} onClick={() => { handleGoTime(start) }} className={`${isAgent ? 'rounded-bl-none' : 'self-end items-end rounded-br-none'} ${isCurrentTime ? isAgent ? 'min-[600px]:translate-x-4' : 'min-[600px]:-translate-x-4' : ''} relative max-w-lg max-[600px]:w-full flex flex-col gap-2 p-6 ring-white/60 ring-1 rounded-xl cursor-pointer hover:opacity-60 shadow-md transition-all duration-300 ease-out`}>
              <div className={`${isAgent ? '-left-4' : '-right-4'} absolute -bottom-4 size-10 ring-white/60 ring-1 rounded-full p-1 bg-bckg`}>
                <img src={`/illustrations/${role}-${randomProfilePicture[role]}.svg`} alt="foto de perfil" className='size-full' />
              </div>
              <p className={`w-fit text-xs ${isCurrentTime ? '' : 'text-neutral-50/50'} capitalize`}>{role}</p>
              <p className={`${isCurrentTime ? 'text-primary' : ''} self-start transition-colors duration-300 ease-out`}>{text}</p>
              <small className={`w-fit text-sm ${isCurrentTime ? '' : 'text-neutral-50/50'}`}>{timeStartFormatted} - {timeEndFormatted}</small>
            </div>
          )
        })
      }
    </section>
  )
}
