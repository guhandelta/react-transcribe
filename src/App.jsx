import { useEffect, useRef, useState } from 'react'
import { FileDisplay, Header, HomePage, Information, Transcribing } from './components'
import './index.css'
import { MessageTypes } from './utils/presets';

function App() {
  const [file, setFile] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [finished, setFinished] = useState(false);

  const isAudioAvailale = file || audioStream;

  function handleAudioReset() {
    setFile(null);
    setAudioStream(null);
  }

  // Create a web worker to handle the ML code in the backend
  const worker = useRef(null)

  useEffect(() => {
    if(!worker.current){
      worker.current = new Worker(
                          new URL('/utils/whisper.worker.js', import.meta.url), 
                          { type: 'module' }
                        ); 
    }

    // Logic to comunicate between the main app and the web worker
    const onMeessageReceived = async (e) => {
      switch(e.data.type){
        case 'DOWNLOADING':
          setDownloading(true);
          console.log('Downloading...');
          break;
        case 'LOADING':
          setLoading(true);
          console.log('Loading...');
          break;
        case 'RESULT':
          setOutput(e.target.results);
          console.log('Results...');
          break;
        case 'INFERENCE_DONE':
          setFinished(true);
          console.log('Finished...');
          break;
      }
    }

    // As the worker threads communicate with the main app/thread through Posting Messages, we need to listen for the messages sent by the worker thread
    worker.current.addEventListener('message', onMeessageReceived);

    // Clean up function to remove the event listener
    return () => {
      worker.current.removeEventListener('message', onMeessageReceived);
    }
  });

  async function readAudioFrom(file){
    // set sampling_rate to 16000 Hz, which is a common sampling rate for voice recordings and speech recognition systems
    const sampling_rate = 16000;

    /* Interface representing an audio-processing graph built from audio modules linked together, each represented by an AudioNode. An AudioContext controls both the creation of the nodes it contains and the execution of the audio processing, or decoding. 
    The sampling rate is mentioned here to ensure that the audio processing happens at the defined sampling rate and that the audio is processed in a way that matches its source or the desired output format. */
    const audioContext = new AudioContext({ sampleRate: sampling_rate });

    // Read the entire file (expected to be an audio file) into memory as an ArrayBuffer. An ArrayBuffer is a generic, fixed-length container for binary data. They are used to represent a generic, fixed-length raw binary data buffer.
    const res = await file.arrayBuffer();

    // The binary data in the ArrayBuffer is passed to decodeAudioData(), an asynchronous method of the AudioContext. This method decodes the audio data contained in the ArrayBuffer, effectively converting it into an AudioBuffer object. The AudioBuffer object stores data in an audio-specific format that makes it easier to process and analyze the audio.
    const decodedAudio = await audioContext.decodeAudioData(res);

    /* Finally, getChannelData(0) extracts the audio data from the first channel of the AudioBuffer. Audio data is typically stored in channels (mono has one channel, stereo has two, etc.). The 0 here refers to the first channel, typically the left channel in stereo recordings or the only channel in mono recordings.
    
    The returned value, audio, is a Float32Array representing the PCM (Pulse Code Modulation) data of the audio, where each sample point is a float describing the amplitude of the sound at that specific point in time.

    */ 
    const audio = decodedAudio.getChannelData(0);
    return audio;
  }

  async function handleFormSubmission(){
    if(!file && !audioStream) return;

    let audio = await readAudioFrom(file ? file : audioStream);
    const model_name = 'openai/whisper-tiny.en';

    worker.current.postMessage({
      type: MessageTypes.INFERENCE_REQUEST,
      audio,
      model_name
    })
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
      </section>
      <footer className=""></footer>
    </div>
  )
}

export default App
