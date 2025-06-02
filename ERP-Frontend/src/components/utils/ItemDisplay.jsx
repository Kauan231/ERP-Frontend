import Placeholder from "../../assets/placeholder.svg";

function ItemDisplay({ content, onDelete }) {
  return (
    <div className=" w-[26vw] h-auto flex gap-2 p-2 bg-white shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl border border-gray-200">
      <img
        src={Placeholder}
        alt="placeholder"
        className="w-[4vw] h-[100%] object-cover rounded-md"
      />

      <div className="flex flex-col flex-1 w-auto">
        <h2 className="text-md font-semibold text-gray-800 truncate w-[15vw]">
          {content.name}
        </h2>

        <p className="text-xs text-gray-500 mb-1 truncate w-[15vw]">
          ID: {content.id}
        </p>

        <p className="text-sm text-gray-700 line-clamp-2 w-[15vw]">
          {content.subtitle ? `Descrição: ${content.subtitle}` : "Sem descrição"}
        </p>
      </div>

      <button
        className="text-black font-bold bg-gray-200 w-[2vw] h-[2vw] rounded-full"
        onClick={() => onDelete(content.id) }
      >
            X
        </button>
    </div>
  );
}

export default ItemDisplay;
