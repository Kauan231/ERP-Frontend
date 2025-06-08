export default function Button ({onClick, title, type}) {
    const colorType = {
        "action": "bg-blue-600",
        "remove": "bg-red-600"
    }

    const colorHoverType = {
        "action": "hover:bg-blue-700",
        "remove": "hover:bg-red-700"
    }

    return (
        <button
            className={`${colorType[type] || colorType["action"]} ${colorHoverType[type] || colorHoverType["action"]} w-full h-10  text-white font-semibold py-2 px-4 rounded`}
            onClick={onClick}
        >
            {title}
        </button>
    )
}