export default function ModalConfirm({ content, onClose, handleConfirm }) {

  return (
    <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-[9999]">
      <div className="w-128 p-6 bg-white rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>
        <div
          className="flex flex-col items-center"
        >
          <h1 className="text-xl font-bold text-black">{content?.title}</h1>
          <p className="text-md mb-4 text-black">{content?.subtitle}</p>

          <div
            className="flex gap-[10%]"
          >
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleConfirm}
            >
              Sim
            </button>

            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={onClose}
            >
              Não
            </button>
          </div>
        </div>


      </div>
    </div>
  );
}
