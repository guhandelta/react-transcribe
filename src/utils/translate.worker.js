import { pipeline } from '@xenova/transformers';

class MyTranslationPipeline {
    static task = 'translation';
    static model = 'Xenova/nllb-200-distilled-600M';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = pipeline(this.task, this.model, { progress_callback });
        }

        return this.instance;
    }
}

// This line sets up an event listener in the web worker to listen for messages sent from the main browser context (typically the main JavaScript thread running in the browser). The self keyword refers to the global context of the web worker itself.
self.addEventListener('message', async (event) => {
    
    /* Translation Pipeline Initialization
    Here, the translation pipeline is initialized by calling a static method getInstance on MyTranslationPipeline. This method is designed to ensure that there is a singleton instance of the pipeline, initializing it if it does not exist.

    The method takes a callback function that posts messages back to the main thread, which can be useful for sending updates or logging progress directly from within the pipeline initialization. 
    
    MyTranslationPipeline.getInstance suggests the use of a singleton pattern to manage the instance of the translation pipeline, ensuring that the pipeline is only initialized once and reused for subsequent translations.
    */

    let translator = await MyTranslationPipeline.getInstance(x => {
        self.postMessage(x)
    })
    console.log(event.data)

    /*
        Performing Translation
            The translator, now initialized, is called with the text and additional options specifying the source and target languages.
            
            The callback_function provided in the options is set up to post intermediate updates back to the main thread. Inside this callback, translator.tokenizer.decode is used to convert the output token IDs back into a readable string, ensuring any special tokens are skipped.
    */
    let output = await translator(event.data.text, {
        tgt_lang: event.data.tgt_lang,
        src_lang: event.data.src_lang,

        callback_function: x => {
            self.postMessage({
                status: 'update',
                output: translator.tokenizer.decode(x[0].output_token_ids, { skip_special_tokens: true })
            })
        }
    })

    console.log('HEHEHHERERE', output)

    self.postMessage({
        status: 'complete',
        output
    })
})