import { useState } from 'react'
import { FileDisplay, Header, HomePage, Information, Transcribing } from './components'
import './index.css'

function App() {
  const [file, setFile] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAudioAvailale = file || audioStream;

  function handleAudioReset() {
    setFile(null);
    setAudioStream(null);
  }

  return(
    <div className="flex flex-col p-4 max-4-[1000px]">
      <section className="min-h-screen flex flex-col">
        <Header />
        {output ? (
          <Information />
        ) : loading ? (
          <Transcribing downloading={loading} />
        ) : isAudioAvailale ? 
            (
              <FileDisplay
                file={file}
                audioStream={audioStream}
                handleAudioReset={handleAudioReset}
              />
            ) : (
              <HomePage 
                setFile={setFile}
                setAudioStream={setAudioStream}
              />
          )
        }
        <main className="flex-1 p-4 flex flex-col justify-center">Sollunga.....</main>
      </section>
      <footer className=""></footer>
    </div>
  )
}

export default App
