function AddNewItemModal({ content, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-[9999]">
      <div className="w-96 p-6 bg-white rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>
        <h1 className="text-xl font-bold mb-4 text-black">{content.title}</h1>

        {
          content.inputs.map((item, index) => {
            return (
              <label className="block mb-2 text-black">
                {item.inputName}
                <input
                  type="text"
                  //defaultValue={item.placeholder}
                  className="w-full border px-3 py-2 rounded mt-1"
                />
              </label>

            )
          })
        }

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Salvar
        </button>
      </div>
    </div>
  );
}

export default AddNewItemModal;
