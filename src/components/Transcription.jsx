/* eslint-disable react/prop-types */


export default function Transcription(props) {

    const { output } = props;

    return (
        <div>
            {output && (
                <p>{output}</p>
            )}
        </div>
    )
}
