'use client'

import React, { useRef, useState, useEffect } from 'react'
import { shallow } from 'zustand/shallow'
import WaveSurfer from 'wavesurfer.js'

// Store
import { useAudioStore } from '@/store/audio-store'

// Utils
import { formatTime } from '@/utils/utils'

// Constants
import { AUDIO_DEMO } from '@/constants/constants'

export default function AudioPlayer (): JSX.Element {
  const waveformRef = useRef(null)
  const waveSurferInstanceRef = useRef<WaveSurfer | null>(null)
  const isFirstRender = useRef(true)
  const [waveform, setWaveform] = useState<WaveSurfer | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeInfo, setTimeInfo] = useState({ currentTime: 0, duration: 0 })
  const [togglePress, setTogglePress] = useState(false)
  const [isBottomWindow, setIsBottomWindow] = useState(false)

  const { audioTime } = useAudioStore((state) => ({
    audioTime: state.audioTime
  }), shallow)
  const { setCurrentAudioTime } = useAudioStore()

  useEffect(() => {
    const onPlayPause = (e: KeyboardEvent): void => {
      if (e.code !== 'Space') return
      e.preventDefault()
      handlePlayPause()
    }
    const onStop = (e: KeyboardEvent): void => {
      if (!e.ctrlKey || e.code !== 'Space') return
      e.preventDefault()
      handleStop()
    }
    const onTwoTimesFaster = (e: KeyboardEvent): void => {
      if (e.key !== 'ArrowRight') return
      e.preventDefault()
      handleTwoTimesFaster()
    }
    const onKeyUp = (e: KeyboardEvent): void => {
      if (e.key !== 'ArrowRight') return
      e.preventDefault()
      handleReturnNormalSpeed()
    }
    const onBottomWindow = (e: Event): void => {
      scrollY + 200 >= innerHeight - 400
        ? setIsBottomWindow(true)
        : setIsBottomWindow(false)
    }
    window.addEventListener('keydown', onPlayPause)
    window.addEventListener('keydown', onStop)
    window.addEventListener('keydown', onTwoTimesFaster)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('scroll', onBottomWindow)

    return () => {
      window.removeEventListener('keydown', onPlayPause)
      window.removeEventListener('keydown', onStop)
      window.removeEventListener('keydown', onTwoTimesFaster)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('scroll', onBottomWindow)
    }
  }, [waveform])

  useEffect(() => {
    if (!isFirstRender.current) return
    if (waveformRef.current == null) return
    isFirstRender.current = false

    waveSurferInstanceRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#ffffff',
      progressColor: '#E42278',
      cursorWidth: 0,
      barWidth: 2,
      height: 100
    })

    void waveSurferInstanceRef.current.load(AUDIO_DEMO)

    waveSurferInstanceRef.current.on('ready', () => {
      if (waveSurferInstanceRef.current == null) return
      setWaveform(waveSurferInstanceRef.current)
      setTimeInfo({
        currentTime: 0,
        duration: waveSurferInstanceRef.current.getDuration()
      })
    })

    waveSurferInstanceRef.current.on('audioprocess', () => {
      const currentTime = Number(waveSurferInstanceRef.current?.getCurrentTime()) ?? 0
      setCurrentAudioTime(currentTime)
      setTimeInfo({
        currentTime,
        duration: waveSurferInstanceRef.current?.getDuration() ?? 0
      })
    })

    waveSurferInstanceRef.current.on('interaction', () => {
      const currentTime = Number(waveSurferInstanceRef.current?.getCurrentTime()) ?? 0
      setCurrentAudioTime(currentTime)
      void waveSurferInstanceRef.current?.play()
    })

    waveSurferInstanceRef.current.on('interaction', () => {
      if (waveform == null) return
      const currentTime = Number(waveform.getCurrentTime()) ?? 0
      setCurrentAudioTime(currentTime)
    })

    waveSurferInstanceRef.current.on('play', () => { setIsPlaying(true) })
    waveSurferInstanceRef.current.on('pause', () => { setIsPlaying(false) })

    return () => {
      if (waveSurferInstanceRef.current == null) return
      waveSurferInstanceRef.current.un('ready', () => { })
      waveSurferInstanceRef.current.un('play', () => { })
      waveSurferInstanceRef.current.un('pause', () => { })
    }
  }, [])

  useEffect(() => {
    if (waveform == null) return
    waveform.seekTo(Number(audioTime) / waveform.getDuration())
    void waveform.play()
  }, [audioTime])

  const handlePlayPause = (): void => {
    if (waveform == null) return
    void waveform.playPause()
  }

  const handleStop = (): void => {
    if (waveform == null) return
    waveform.stop()
  }
  const handleTwoTimesFaster = (): void => {
    if (waveform?.getCurrentTime() === waveform?.getDuration() || waveform?.isPlaying() === false) return
    setTogglePress(true)
    if (waveform == null) return
    waveform.setPlaybackRate(2)
  }

  const handleReturnNormalSpeed = (): void => {
    setTogglePress(false)
    if (waveform == null) return
    waveform.setPlaybackRate(1)
  }

  return (
    <section className={`fixed bottom-6 ${!isBottomWindow ? 'max-[600px]:bottom-6' : 'max-[600px]:-bottom-20'} right-6 max-[600px]:right-0 max-[600px]:left-0 max-[600px]:mx-6 flex p-8 rounded-full ring-1 ring-neutral-50 max-h-[60px] after:absolute after:inset-0 after:bg-bckg/80 max-[600px]:after:bg-bckg after:size-full after:rounded-full transition-all  duration-300 ease-out`}>
      <div className='w-full items-center justify-between flex gap-6 z-50'>
        <div className='w-full flex flex-col gap-2 h-[60px] justify-center overflow-y-hidden'>
          <div className='w-[200px] cursor-pointer' ref={waveformRef}></div>
          <small className='absolute -bottom-4 left-8 bg-bckg py-1 px-4 rounded-full ring-1 ring-neutral-50 z-50'>{formatTime(timeInfo.currentTime) ?? '00:00'} - {formatTime(timeInfo.duration) ?? '00:00'}</small>
        </div>
        <div className='flex h-fit gap-4'>
          <button onClick={handlePlayPause} className={`${isPlaying ? 'bg-neutral-50 hover:ring-offset-bckg [&>img]:invert' : 'bg-bckg hover:ring-offset-bckg'} size-[40px] p-1.5 flex justify-center items-center ring-1 ring-neutral-50 rounded-full hover:ring-offset-4 transition-all duration-300 ease-out`} title='Click/Espacio'>
            {
              !isPlaying
                ? <img className='size-full' src="/icons/play-icon.svg" alt="reproducir" />
                : <img className='size-full' src="/icons/pause-icon.svg" alt="pausar" />
            }
          </button>
          <button onClick={handleStop} className='size-[40px] p-1.5 flex justify-center items-center bg-bckg ring-1 ring-neutral-50 rounded-full hover:ring-offset-bckg hover:ring-offset-4 transition-all duration-300 ease-out' title='Click/Control + Espacio'>
            <img className='size-[90%]' src="/icons/stop-icon.svg" alt="detener" />
          </button>
          <button onMouseDown={handleTwoTimesFaster} onMouseUp={handleReturnNormalSpeed} className={`${togglePress ? 'bg-neutral-50 hover:ring-offset-bckg [&>img]:invert' : 'bg-bckg hover:ring-offset-bckg'} size-[40px] p-1.5 flex justify-center items-center bg-bckg border-2 border-dashed ring-neutral-50 rounded-full hover:ring-offset-bckg hover:ring-offset-4 transition-all duration-300 ease-out`} title='Mantener(Click/Flecha Izq.)'>
            <img className='size-full' src="/icons/forward-icon.svg" alt="acelerar x2" />
          </button>
        </div>
      </div>
    </section>
  )
}
