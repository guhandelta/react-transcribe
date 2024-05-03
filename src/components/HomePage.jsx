/* eslint-disable react/prop-types */

import { useEffect, useRef, useState } from "react";


export default function HomePage(props){
    const { setFile, setAudioStream } = props;

    const [recordingStatus, setRecordingStatus] = useState('inactive');
    const [audioChunks, setAudioChunks] = useState([]);
    const [duration, setDuration] = useState(0);

    const mediaRecorder = useRef(null);

    const mimeType = 'audio/webm';

    async function startRecording(){
        let tempStream;

        try{
            // Request access to the user's audio device (like a microphone) without accessing the video device. The getUserMedia method is a part of the WebRTC API, which allows real-time communication capabilities in web browsers. This method returns a promise that resolves to a MediaStream containing the tracks of the requested media types. Here, it's configured to capture only audio.
            const streamData = await navigator.mediaDevices.getUserMedia({ audio: true, video: false});
            tempStream = streamData;
        }catch(err){
            console.log(err.message);
            return;
        }

        setRecordingStatus('recording');

        // Create a new MediaRecorder instance using the stream, to record the stream
        const media = new MediaRecorder(tempStream, { mimeType });

        // Set the MediaRecorder instance to the media reference
        mediaRecorder.current = media;
        // start the recording
        mediaRecorder.current.start();
        let audioChunks = [];

        mediaRecorder.current.ondataavailable = event => {
            if(typeof event.type === 'undefined') return;
            if(event.data.size === 0) return;
            audioChunks.push(event.data);
        }
        setAudioChunks(audioChunks);
    }

    async function stopRecording(){
        setRecordingStatus('inactive');
        // Stop the recording
        mediaRecorder.current.stop();
        mediaRecorder.current.onStop = () => {

            /**************
                A Blob (Binary Large Object) represents immutable raw binary data, and it can handle large amounts of data that aren't necessarily in a specific format. Blobs are typically used to handle file data obtained from or meant to be written to the disk. The Blob object in JavaScript provides a file-like structure of immutable, raw data. Blobs are particularly useful for streaming data, like media files, from the client to a server or vice versa, or for saving data client-side using APIs like localStorage.
            ***************/

            // new Blob(): This constructor creates a new Blob(An audio Blob, as the mime type mentioned here is audio format) object containing the data in audioChunks. The second parameter specifies the Blob's MIME type, ensuring that the data is interpreted correctly by whatever processes it next.
            const audioBlob = new Blob(audioChunks, { type: mimeType });
            setFile(audioBlob);
            // setAudioChunks to the default value of []
            setAudioChunks([]);
            setDuration(0);
        };


        setAudioStream(audioChunks);
    }

    useEffect(() => {
        if(recordingStatus === 'inactive') return;

        const interval = setInterval(() => {
            setDuration(curr => curr + 1);
        }, 1000);
    
        return () => clearInterval(interval);
    })
    

    return (
        <main className="p-4 flex flex-col flex-1 gap-3 text-center sm:gap-4 md:gap-5 justify-center pb-20">
            <h1 className="font-semibold text-5xl sm:text-6xl md:text-7xl">மொழி<span className="text-blue-400 bold">பெயர்</span></h1>
            <h3 className="font-medium md:text-lg">
                Record&nbsp;
                <span className="text-blue-400">&rarr;</span> Transcribe&nbsp;
                <span className="text-blue-400">&rarr;</span> Translate
            </h3>


            <button 
                className="flex special-button px-4 py-2 rounded-xl items-center text-base justify-between gap-4 mx-auto w-72 max-w-full my-4"
                onClick={recordingStatus === 'recording'? stopRecording : startRecording}
            >
                <p className="text-blue-500">{
                    recordingStatus === 'inactive'?
                    'Record':
                    `Stop recording`
                }</p>
                <div className="flex items-center">
                    {duration && ( 
                            <p className="text-sm">{duration}s</p>
                        )
                    }
                    
                    <i className={"fa-solid duration-200 fa-microphone" + 
                                    recordingStatus === 'active'?
                                    'text-rose-500':
                                    'text-blue-500' }></i>
                </div>
            </button>
            <p className="text-base">
                Or 
                {/* htmlFor */}
                <label className="px-2 text-blue-400 cursor-pointer hover:text-blue-700 duration-200">upload
                    <input 
                        type="file" 
                        onChange={(e) => {
                            setFile(e.target.files[0])
                        }}
                        className="hidden"
                        accept=".mp3,.wav" 
                    /> &nbsp; 
                </label>&nbsp;a mp3 file
            </p>
            <p className="italic text-slate-400">free now, free forever</p>
        </main>
    )
}
