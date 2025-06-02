export default function Button ({onClick, title}) {
    return (
        <button
            className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            onClick={onClick}
        >
            {title}
        </button>
    )
}