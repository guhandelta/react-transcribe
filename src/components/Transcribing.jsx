/* eslint-disable react/prop-types */


export default function Transcribing(props) {

    const { downloading } = props;

    return (
        <div className="flex flex-col items-center justify-center gap-10 md:gap-14 py-24">
            <div className="flex flex-col">
                <h1 className="font-semibold text-4xl sm:text-5xl md:text-6xl">
                    Your
                    <span className="text-blue-400 bold">
                        File
                    </span>
                </h1>
                <p className="my-8 text-lg">
                    {!downloading ? 'Transcribing...' : 'Transcription ready for download'}
                </p>
            </div>
            <div className="flex flex-col gap-2 sm:gap-4 max-w-[500px] mx-auto w-full">
                {[0,1,2].map(val =>{
                    return(
                        <div
                            key={val} 
                            className={"h-2 sm:h-3 rounded-full bg-slate-400 loading " + `loading${val}`}>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
