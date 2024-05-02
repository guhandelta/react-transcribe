

export default function Header(){
    return (
        <div>
            <header className="flex items-center justify-between gap-4">
                <h1 className="">
                மொழி<span className="text-blue-400">பெயர்</span>
                </h1>
                <button className="flex items-center gap-2 special-button px-3 py-2 rounded-lg text-blue-400">
                    <p>New</p>
                    <i className="fa-solid fa-plus"></i>
                </button>
            </header>
        </div>
    )
}
