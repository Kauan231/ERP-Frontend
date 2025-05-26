import { useRef, useState } from "react";

export default function ModalWithInputs({ content, onClose }) {
  const refs = useRef([]);
  const [selectedDropdown, setSelectedDropdown] = useState(null);

  const handleSave = () => {
    content.onSelectChange?.(selectedDropdown);
    let contentFromRefs = refs.current.map((ref, index) => {
      return {
        id: content.inputs[index]?.id,
        type: content.inputs[index]?.type,
        name: content.inputs[index]?.name,
        value: ref.value
      }
    });
    content.onButtonClick?.({
      selectedDropdown,
      refs: contentFromRefs
    });
  };

  const dataToElement = (data, index) => {
    if (data.type === "dropdown") {
      return (
        <select
          key={data.id || index}
          className="text-black w-full p-2 mb-6 mt-6 rounded-lg border-2 border-blue-800"
          value={selectedDropdown || ""}
          onChange={e => setSelectedDropdown(e.target.value)}
          ref={el => {
            if (el) refs.current[index] = el;
          }}
        >
          <option value="" disabled>
            Selecione
          </option>
          {data.options.map((option, i) => (
            <option key={option.id || i} value={option.id}>
              {option.text}
            </option>
          ))}
        </select>
      );
    }

    if (data.type === "normal") {
      return (
        <label key={data.id || index} className="block mb-2 text-black">
          {data.name}
          <input
            type="text"
            className="w-full border px-3 py-2 rounded mt-1"
            ref={el => {
              if (el) refs.current[index] = el;
            }}
          />
        </label>
      );
    }

    if (data.type === "custom") {
      return data.elements();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-[9999]">
      <div className="w-128 p-6 bg-white rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>
        <h1 className="text-xl font-bold mb-4 text-black">{content.title}</h1>

        {content.inputs.map((item, index) => dataToElement(item, index))}

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleSave}
        >
          {content.saveButtonText || "Salvar"}
        </button>
      </div>
    </div>
  );
}
