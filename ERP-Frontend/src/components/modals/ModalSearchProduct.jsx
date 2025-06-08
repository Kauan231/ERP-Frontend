import { useRef, useState, useContext, useEffect } from "react";
import Input from "../inputs/Input";
import { AuthContext } from "../../context/AuthContext";
import Placeholder from "../../assets/placeholder.svg";

export default function ModalSearchProduct({ title, saveButtonText, onClose }) {
  //Auth
  const { user, setUser } = useContext(AuthContext);

  const [results, setResults] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedInventoryId, setSelectedInventoryId] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("text");
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    setSearch("");
    setResults([]);
  }, [currentStep]);

  const searchForProducts = async () => {
    setSelectedProductId(undefined);
    if(search?.length < 3) {
      return setResults([]);
    };
    let baseUrl = "https://localhost:7011/Product?skip=0&limit=100&search="+search;
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

  const searchForInventories = async () => {
    setSelectedInventoryId(undefined);
    if(search?.length < 3) {
      return setResults([]);
    };
    let baseUrl = "https://localhost:7011/Inventory?skip=0&limit=2&search="+search;
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
    if(currentStep == 0) {
      setPlaceholder("Digite o nome do produto");
      return (
        <>
        {results?.allProducts?.length > 0 && (
          <div className="space-y-4">
            <div
              className="max-h-128 overflow-y-scroll"
            >
              {results.allProducts.map((product) => (
                <SearchItemSelect
                  item={product}
                  onSelect={setSelectedProductId}
                  selectedCondition={selectedProductId == product.id}
                />
              ))}
            </div>

            <div className="w-full flex justify-end">
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
                onClick={() => {
                  if(selectedProductId != undefined) {
                    setCurrentStep(1);
                  }
                }}
              >
                {saveButtonText || "Próximo"}
              </button>
            </div>
          </div>
        )}
        </>
      )
    }

    if(currentStep == 1) {
      setPlaceholder("Digite o nome do inventário");
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
                    setCurrentStep(2);
                  }
                }}
              >
                {saveButtonText || "Próximo"}
              </button>
            </div>
          </div>
        )}
        </>
      )
    }

    if(currentStep == 2) {
      setPlaceholder("Digite a quantia");
      setType("number")
      return (
        <>
          <div className="space-y-4">
            <div className="w-full flex justify-end">
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
                onClick={() => {
                  if(search != undefined) {
                    submitProduct();
                  }
                }}
              >
                {saveButtonText || "Adicionar"}
              </button>
            </div>
          </div>
        </>
      )
    }

  }

  const submitProduct = async () => {
     const requestBody = {
          amount: Number(search),
          productId: selectedProductId,
          inventoryId: selectedInventoryId
      };

    let baseUrl = "https://localhost:7011/Inventory/InventoryItem";
    const res = await fetch(baseUrl, {
      method: "POST",
      body: JSON.stringify(requestBody),
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
        <h1 className="text-xl font-bold mb-4 text-black">{"Adicionar produto a inventário"}</h1>

        <div
          className="flex flex-col mb-8"
        >
          <div
            className="mb-5"
          >
            <Input
              placeholder={placeholder}
              value={search}
              type={type}
              onChange={async (e) => {
                setSearch(e.target.value)
                if(currentStep == 0) {
                  return await searchForProducts();
                }
                if(currentStep == 1) {
                  return await searchForInventories();
                }
              }}
            />

          </div>

          <PageManager />
        </div>
      </div>

    </div>
  );
}
