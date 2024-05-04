// Xenova  works with HuggingFace and allows to use the models available in HuggingFace
import { pipeline } from "@xenova/transformers"
import { MessageTypes } from "./presets"

class MyTranscriptionPipeline{
    static task = 'automatic-speech-recognition'
    static model = 'openai/whisper-tiny.en'
    static instance = null

    // This fn() is really important as it will be used to communicate all the statuses with the main fn()
    static async getInstance(progress_callback = null){
        if (this.instance === null) {
            this.instance = await pipeline(this.task, null, { progress_callback })
        }
        // Instantiate if it does not exist
        return this.instance
    }
}

// This is for event listener for the messages sent from the main file
self.addEventListener('message', async (e) => {
    const {type, audio } = e.data;

    if(type === MessageTypes.INFERENCE_REQUEST){
        await transcribe(audio);
    }
});


async function load_modal_callback(data){
    const { status } = data;
    if(status === 'progress'){
        const { file, progress, loaded, total } = data
        sendDownloadingMessage(file, progress, loaded, total);
    }
}

function sendLoadingMessage(data){
    self.postMessage({
        type: MessageTypes.LOADING,
        data
    });
}

async function sendDownloadingMessage( file, progress, loaded, total ){
    self.postMessage({
        type: MessageTypes.DOWNLOADING,
        file, 
        progress, 
        loaded, 
        total 
    });
}

async function transcribe(audio) {
    sendLoadingMessage('loading')
    
    let transcriptionPipeline;
    try {
        transcriptionPipeline = await MyTranscriptionPipeline.getInstance(load_modal_callback);
    } catch (error) {
        console.log(error.message);
        return;  // Ensure to exit if there is an error during initialization
    }
    
    sendLoadingMessage('success');

    const stride_length_s = 5;
    const generationTracker = new GenerationTracker(transcriptionPipeline, stride_length_s);

    // Use the pipeline correctly
    await transcriptionPipeline(audio, {
        top_k: 0,
        do_sample: false,
        chunk_length: 30,
        stride_length_s,
        return_timestamps: true,
        callback_function: generationTracker.callbackFunction.bind(generationTracker),
        chunk_callback: generationTracker.chunkCallback.bind(generationTracker),
    });

    generationTracker.sendFinalResult();
}

class GenerationTracker{
    constructor(pipeline, stride_length_s){
        this.pipeline = pipeline
        this.stride_length_s = stride_length_s
        this.chunks = []
        this.time_precision = pipeline?.processor.feature_extractor.config.chunk_length / pipeline.model.config.max_source_positions
        this.processed_chunks = []
        this.callbackFunctionCounter = 0
    }
    
    async sendFinalResult(){
        self.postMessage({
            type: MessageTypes.INFERENCE_DONE,
        })
    }

    callbackFunction(beams){
        this.callbackFunctionCounter += 1
        if(this.callbackFunctionCounter % 10 !== 0) return;

        const bestBeam = beams[0];
        let text = this.pipeline
                        .tokenizer
                        .decode(bestBeam.output_token_ids, { 
                            skip_special_tokens: true 
                        });
        const result = {
            text,
            start: this.getLastChunkTimestamp(),
            end: undefined
        }

        createPartialResultMessage(result)
    }

    chunkCallback(data){
        this.chunks.push(data);
        // eslint-disable-next-line no-unused-vars
        const [ text, { chunks } ] = this.pipeline.tokenizer._decode_asr(
            this.chunks,
            {
                time_precision: this.time_precision,
                return_timestamps: true,
                force_full_sequnce: false,
            }
        );
        
        this.processed_chunks = chunks.map((chunk, index) => {
            this.processChunk(chunk, index);
        });

        createResultMessage(
            this.processed_chunks, 
            false, 
            this.getLastChunkTimestamp()
        );
    }

    getLastChunkTimestamp(){
        if(this.processed_chunks===0) return 0;
    }

    processChunk(chunk, index){
        const { text, timestamp } = chunk;
        const [start, end] = timestamp;

        return{
            index,
            text: `${text.trim()}`,
            start: Math.round(start),
            end: Math.round(end) || Math.round(start + 0.9 * this.stride_length_s)
        };
    }
}

function createResultMessage(results, isDone, completedUntilTimestamp){
    self.postMessage({
        type: MessageTypes.RESULT,
        results,
        isDone,
        completedUntilTimestamp
    });
}

function createPartialResultMessage(result){
    self.postMessage({
        type: MessageTypes.RESULT_PARTIAL,
        result
    });
}