import Placeholder from "../../assets/placeholder.svg";

function ItemDisplay({ content }) {
  return (
    <div className="bg-white shadow-md hover:shadow-xl transition-shadow duration-300 p-2 rounded-xl w-[19vw] h-[10vh] max-w-sm flex gap-4 items-start border border-gray-200">
      <img
        src={Placeholder}
        alt="placeholder"
        className="w-16 h-16 object-cover rounded-md"
      />

      <div className="flex flex-col flex-1">
        <h2 className="text-md font-semibold text-gray-800 truncate">
          {content.name}
        </h2>

        <p className="text-xs text-gray-500 mb-1 truncate">
          ID: {content.id}
        </p>

        <p className="text-sm text-gray-700 line-clamp-2">
          {content.subtitle ? `Descrição: ${content.subtitle}` : "Sem descrição"}
        </p>
      </div>
    </div>
  );
}

export default ItemDisplay;
