export default function Button ({onClick, title}) {
    return (
        <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded h-10"
            onClick={onClick}
        >
            {title}
        </button>
    )
}