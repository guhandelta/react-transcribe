import { useState } from "react"
import Transcription from "./Transcription";
import Translation from "./Translation";


export default function Information(props) {

    const [tab, setTab] = useState('transcription');

    return (
        <main className="p-4 flex flex-col flex-1 gap-3 text-center sm:gap-4 md:gap-5 justify-center pb-20 max-w-prose w-full mx-auto">
            <h1 className="font-semibold text-4xl sm:text-5xl md:text-6xl">
                Your
                <span className="text-blue-400 px-4 bold whitespace-nowrap">
                    Transcription
                </span>
            </h1>
            <div className="grid grid-cols-2 mx-auto bg-white shadow rounded-full overflow-hidden items-center">
                <button 
                    className={"px-4 py-2 font-medium" + (tab === 'transcription' ? ' bg-blue-400 text-white' : 'text-blue-400 hover:text-blue-700 duration-200')}
                    onClick={() => setTab('transcription')}
                >
                    Transcription
                </button>
                <button 
                    className={"px-4 py-2 font-medium" + (tab === 'translation' ? ' bg-blue-400 text-white' : 'text-blue-400 hover:text-blue-700 duration-200')}
                    onClick={() => setTab('translation')}
                >
                    Translation
                </button>
            </div>
            {tab === 'transcription' ? (
                <Transcription {...props} />
            ) : (
                <Translation {...props} />
            )}
        </main>
    )
}
