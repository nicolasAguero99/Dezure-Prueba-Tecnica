// Components
import TranscriptionList from './transcription-list'
import AudioPlayer from './audio-player'
import Footer from './footer'

export default function MainPage (): JSX.Element {
  return (
    <main>
      <TranscriptionList />
      <AudioPlayer />
      <Footer />
    </main>
  )
}
