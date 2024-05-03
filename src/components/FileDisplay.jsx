/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// import PropTypes from 'prop-types';

// FileDisplay.propTypes = {
//     file: PropTypes.func.isRequired,
//     audioStream: PropTypes.func.isRequired,
//     handleAudioReset: PropTypes.func.isRequired,
// };

const FileDisplay = (props) => {
    const { file, audioStream, handleAudioReset, handleFormSubmission } = props;

    function generateFilename() {

        // Generate a timestamp-based filename if no file is provided
        const timestamp = new Date().toISOString().replace(/[-:.T]/g, '').slice(0, 14); // ISO string without punctuation
        return `${timestamp}_audio`;
    }

    return (
        <main className="p-4 flex flex-col flex-1 gap-3 text-center sm:gap-4 md:gap-5 justify-center pb-20 w-72 sm:w-90 max-w-full mx-auto">
            <h1 className="font-semibold text-4xl sm:text-5xl md:text-6xl">
                Your
                <span className="text-blue-400 bold">
                    File
                </span>
            </h1>
            <div className="flex text-left my-4">
                <h3 className="font-semibold">Name:&nbsp;</h3>
                <p className="">{file ? file?.name : generateFilename()}</p>
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