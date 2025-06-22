import { useState, useContext, useEffect } from "react";
import Input from "../inputs/Input";
import Placeholder from "../../assets/placeholder.svg";
import { AuthContext } from "../../context/AuthContext";
import { BusinessContext } from "../../context/BusinessContext";

export default function ModalRemoveInventory({ onClose }) {
  //Auth
  const { user, setUser } = useContext(AuthContext);
  const { currentBusiness } = useContext(BusinessContext);

  const [results, setResults] = useState([]);
  const [selectedInventoryId, setSelectedInventoryId] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    searchForInventories();
  }, []);

  useEffect(() => {
    if(search == "") {
      searchForInventories();
    }
  }, [search]);


  const searchForInventories = async () => {
    setSelectedInventoryId(undefined);
    let baseUrl = `https://localhost:7011/Inventory?businessId=${currentBusiness}&skip=0&limit=100&search=${search}`;
    const res = await fetch(baseUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${JSON.parse(user.token).token}`
      }
    });

    if (!res.ok) {
      console.error("Erro ao buscar dados:", res.status);
      if (res.status === 404) {
        setUser(null);
      }
      return;
    }

    const result = await res.json();
    setResults(result);
  }

  const SearchItemSelect = ({item, onSelect, selectedCondition}) =>  {
    return (
      <div
        key={item.id}
        className={`${selectedCondition ?  "bg-gray-200" : "bg-white"} w-full flex items-center gap-6 border border-gray-200 rounded-2xl shadow-sm px-8 py-4 hover:shadow-md transition`}
        onClick={() => onSelect(item.id)}
      >
        <img
          src={Placeholder}
          alt={item.name}
          className="w-16 h-16 object-contain rounded-md"
        />
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-800">{item.name}</h1>
          <p className="text-gray-500">{item?.description}</p>
        </div>
      </div>
    )
  }

  const PageManager = () => {
    return (
      <>
      {results?.length > 0 && (
        <div className="space-y-4">
          <div
            className="max-h-128 overflow-y-scroll"
          >
            {results.map((inventory) => (
              <SearchItemSelect
                item={inventory}
                onSelect={setSelectedInventoryId}
                selectedCondition={selectedInventoryId == inventory.id}
              />
            ))}
          </div>

          <div className="w-full flex justify-end">
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
              onClick={() => {
                if(selectedInventoryId != undefined) {
                  deleteInventory();
                }
              }}
            >
              Remover
            </button>
          </div>
        </div>
      )}
      </>
    )
  }

  const deleteInventory = async () => {
    let baseUrl = "https://localhost:7011/Inventory/"+selectedInventoryId;
    const res = await fetch(baseUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${JSON.parse(user.token).token}`
      }
    });

    if (!res.ok) {
      console.error("Erro ao buscar dados:", res.status);
      if (res.status === 404) {
        setUser(null);
      }
      return;
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-[9999] text-black">
      <div className="w-[60vw] p-6 bg-white rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>
        <h1 className="text-xl font-bold mb-4 text-black">{"Remover inventário"}</h1>

        <div
          className="flex flex-col mb-8"
        >
          <div
            className="mb-5"
          >
            <Input
              placeholder={"Digite o nome do Inventário para remover"}
              value={search}
              type={"text"}
              onChange={async (e) => {
                setSearch(e.target.value)
                return await searchForInventories();
              }}
            />

          </div>

          <PageManager />
        </div>
      </div>

    </div>
  );
}
