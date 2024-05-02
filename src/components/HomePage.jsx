

export default function HomePage(){
    return (
        <main className="p-4 flex flex-col flex-1 gap-3 text-center sm:gap-4 md:gap-5 justify-center pb-20">
            <h1 className="font-semibold text-5xl sm:text-6xl md:text-7xl">மொழி<span className="text-blue-400 bold">பெயர்</span></h1>
            <h3 className="font-medium md:text-lg">
                Record&nbsp;
                <span className="text-blue-400">&rarr;</span> Transcribe&nbsp;
                <span className="text-blue-400">&rarr;</span> Translate
            </h3>
            <button className="flex special-button px-4 py-2 rounded-xl items-center text-base justify-between gap-4 mx-auto w-72 max-w-full my-4">
                <p className="text-blue-500">Record</p>
                <i className="fa-solid fa-microphone"></i>
            </button>
            <p className="text-base">
                Or 
                <label htmlFor="" className="px-2 text-blue-400 cursor-pointer hover:text-blue-700 duration-200">upload
                    <input type="file" hidden accept=".mp3,.wav" /> a mp3 file
                    <p className="italic text-slate-500">free now, free forever</p>
                </label>
            </p>
        </main>
    )
}
