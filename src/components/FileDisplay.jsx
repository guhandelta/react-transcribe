/* eslint-disable react/prop-types */
// import PropTypes from 'prop-types';

// FileDisplay.propTypes = {
//     file: PropTypes.func.isRequired,
//     audioStream: PropTypes.func.isRequired,
//     handleAudioReset: PropTypes.func.isRequired,
// };

const FileDisplay = (props) => {
    const { file, audioStream, handleAudioReset } = props;
    return (
        <main className="p-4 flex flex-col flex-1 gap-3 text-center sm:gap-4 md:gap-5 justify-center pb-20">
            <h1 className="font-semibold text-4xl sm:text-5xl md:text-6xl">
                Your
                <span className="text-blue-400 bold">
                    File
                </span>
            </h1>
            <div className="mx-auto flex text-left my-4">
                <h3 className="font-semibold">Name:&nbsp;</h3>
                <p className="">{file?.name}</p>
            </div>
                <div className="flex items-center justify-around gap-4">
                    <button className="text-slate-400">Reset</button>
                    <button className="flex special-button px-3 p-2 rounded-lg text-blue-400 items-center gap-2 font-medium">
                        <p>Transcribe</p> 
                        <i className="fa-solid fa-pen-nib"></i>
                    </button>
                </div>
        </main>
    )
}

export default FileDisplay