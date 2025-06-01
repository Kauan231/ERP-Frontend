export default function BasicInput ({onChange, value, placeholder, type}) {
    return (
        <input
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            type={type}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
    )
}