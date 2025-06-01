export function Pagination({currentPage, totalPages, setCurrentPage}) {
    return (
        <div className="flex justify-center items-center gap-3 mt-4 flex-wrap text-sm text-black">
        <button
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className="px-2 py-1 hover:bg-gray-100 disabled:opacity-40"
          title="Primeira página"
        >
          ⏮
        </button>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-2 py-1 hover:bg-gray-100 disabled:opacity-40 font-bold"
          title="Página anterior"
        >
          {'<'}
        </button>

        <span className="flex items-center gap-1">
          Página
          <input
            type="number"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const page = Number(e.target.value);
              if (!isNaN(page) && page >= 1 && page <= totalPages) {
                setCurrentPage(page);
              }
            }}
            className="w-12 text-center rounded px-1 py-0.5"
          />
          de {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-2 py-1 hover:bg-gray-100 disabled:opacity-40 font-bold"
          title="Próxima página"
        >
          {'>'}
        </button>
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className="px-2 py-1 hover:bg-gray-100 disabled:opacity-40"
          title="Última página"
        >
          ⏭
        </button>
      </div>
    )
}