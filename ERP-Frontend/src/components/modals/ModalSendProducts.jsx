import { useState, useContext, useEffect } from "react";
import Input from "../inputs/Input";
import { AuthContext } from "../../context/AuthContext";
import { BusinessContext } from "../../context/BusinessContext";
import Placeholder from "../../assets/placeholder.svg";

export default function ModalSendProducts({ title, saveButtonText, onClose }) {
  const { user, setUser } = useContext(AuthContext);
  const { currentBusiness } = useContext(BusinessContext);

  const [currentStep, setCurrentStep] = useState(0);

  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [addedProducts, setAddedProducts] = useState([]);
  const [currentAmount, setCurrentAmount] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [inventories, setInventories] = useState([]);
  const [inventorySearch, setInventorySearch] = useState("");
  const [selectedInventory, setSelectedInventory] = useState(null);

  const [clients, setClients] = useState([]);
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [totalOfItems, setTotalOfItems] = useState(0);

  useEffect(() => {
    setSearch("");
    setResults([]);
    setInventorySearch("");
    setInventories([]);
    setClientSearch("");
    setClients([]);
  }, [currentStep]);

  // Buscas
  const searchForProducts = async () => {
    if (search?.length < 3) {
      setResults([]);
      return;
    }

    const baseUrl = `https://localhost:7011/Inventory/InventoryItem/ReadAll?businessId=${currentBusiness}&skip=0&limit=100&search=${search}&inventoryIds=${selectedInventory.id}`;
    const res = await fetch(baseUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${JSON.parse(user.token).token}`
      }
    });



    if (!res.ok) {
      console.error("Erro ao buscar produtos:", res.status);
      if (res.status === 404) setUser(null);
      return;
    }

    const result = await res.json();

    let items = result.allInventoryItems.map((item) => {
      return {
        id: item.id,
        productId: item.product.id,
        name: item.product.name,
        description: item.product.description,
        businessId: item.product.businessId,
        maxAmount: item.amount
      }
    })
    setResults(items || []);
  };

  const searchForInventories = async () => {
    if (inventorySearch?.length < 2) {
      setInventories([]);
      return;
    }

    const baseUrl = `https://localhost:7011/Inventory?businessId=${currentBusiness}&skip=0&limit=50&search=${inventorySearch}`;
    const res = await fetch(baseUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${JSON.parse(user.token).token}`
      }
    });

    if (!res.ok) {
      console.error("Erro ao buscar inventários:", res.status);
      if (res.status === 404) setUser(null);
      return;
    }

    const result = await res.json();
    setInventories(result || []);
  };

  const getClients = async () => {
    const skip = (currentPage - 1) * limit;
    let baseUrl = `https://localhost:7011/Business/${currentBusiness}/Clients?`;
    let resUrl = `${baseUrl}search=${clientSearch}&skip=${skip}&limit=${limit}`;

    const res = await fetch(resUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${JSON.parse(user.token).token}`
      }
    });

    if (!res.ok) {
      console.error("Erro ao buscar clientes:", res.status);
      if (res.status === 404) setUser(null);
      return;
    }

    let results = await res.json();
    setTotalOfItems(results.totalOfItems);
    results = results.clients.map((client) => {
      client.subtitle = client.description;
      delete client.description;
      return client;
    });

    setClients(results);
  };

  const addProductToList = () => {
    if (!selectedProduct || currentAmount <= 0) return;

    if (addedProducts.some(p => p.productId === selectedProduct.id)) {
      console.warn("Produto já adicionado");
      return;
    }

    setAddedProducts(prev => [
      ...prev,
      {
        id: selectedProduct.id,
        productId: selectedProduct.productId,
        name: selectedProduct.name,
        amount: currentAmount
      }
    ]);

    setSelectedProduct(null);
    setCurrentAmount(1);
    setSearch("");
    setResults([]);
  };

  const removeProductFromList = (productId) => {
    setAddedProducts(prev => prev.filter(p => p.productId !== productId));
  };

  const submitAll = async () => {
    if (!selectedInventory || !selectedClient || addedProducts.length === 0) return;

    let orderItemsToSend  = addedProducts.map((item) => {
      return {
        id: item.id,
        amount: item.amount,
        productId: item.productId,
        inventoryId: selectedInventory.id,

      }
    })

    const requestBody = {
      orderItems: orderItemsToSend,
      inventoryId: selectedInventory.id,
      clientId: selectedClient.id
    };

    const res = await fetch("https://localhost:7011/Shipment/Send", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${JSON.parse(user.token).token}`
      }
    });

    if (!res.ok) {
      console.error(`Erro ao enviar items`, res.status);
      if (res.status === 404) setUser(null);
    }

    onClose();
  };

  const renderStep = () => {
    if (currentStep === 0) {
      // INVENTORY STEP
      return (
        <>
          <Input
            placeholder="Digite o nome do inventário"
            value={inventorySearch}
            onChange={async (e) => {
              setInventorySearch(e.target.value);
              await searchForInventories();
            }}
          />
          <div className="max-h-48 overflow-y-auto mt-4 space-y-2">
            {inventories.map((inventory) => (
              <div
                key={inventory.id}
                className={`border rounded p-2 cursor-pointer ${
                  selectedInventory?.id === inventory.id ? "bg-blue-100 border-blue-300" : "bg-white"
                } hover:bg-blue-50`}
                onClick={() => setSelectedInventory(inventory)}
              >
                {inventory.name}
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-4">
            <button
              disabled={!selectedInventory}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              onClick={() => setCurrentStep(1)}
            >
              Próximo
            </button>
          </div>
        </>
      );
    }

    if (currentStep === 1) {
      // PRODUCT STEP
      return (
        <>
          <Input
            placeholder="Digite o nome do produto"
            value={search}
            onChange={async (e) => {
              setSearch(e.target.value);
              await searchForProducts();
            }}
          />
          <div className="max-h-48 overflow-y-auto mt-4 space-y-2">
            {results.map((product) => (
              <div
                key={product.id}
                className="border rounded p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedProduct(product)}
              >
                {product.name}
              </div>
            ))}
          </div>

          {selectedProduct && (
            <div className="mt-3 flex items-center gap-3">
              <span>{selectedProduct.name}</span>
              <input
                type="number"
                min="1"
                value={currentAmount}
                max={selectedProduct.maxAmount}
                onChange={(e) => setCurrentAmount(Number(e.target.value))}
                className="w-20 border rounded px-2 py-1"
              />
              <button
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                onClick={addProductToList}
              >
                Adicionar
              </button>
            </div>
          )}

          {addedProducts.length > 0 && (
            <div className="mt-4 border rounded p-3 bg-gray-50">
              <h2 className="font-semibold mb-2">Produtos adicionados</h2>
              {addedProducts.map((p) => (
                <div
                  key={p.productId}
                  className="flex justify-between items-center border rounded px-2 py-1 bg-white mb-1"
                >
                  <span>{p.name} — {p.amount}</span>
                  <button
                    className="text-red-500 hover:text-red-700 text-xs"
                    onClick={() => removeProductFromList(p.productId)}
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between mt-4">
            <button
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              onClick={() => setCurrentStep(0)}
            >
              Voltar
            </button>
            <button
              disabled={addedProducts.length === 0}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              onClick={() => setCurrentStep(2)}
            >
              Próximo
            </button>
          </div>
        </>
      );
    }

    if (currentStep === 2) {
      // CLIENT STEP
      return (
        <>
          <Input
            placeholder="Digite o nome do cliente/fornecedor"
            value={clientSearch}
            onChange={async (e) => {
              setClientSearch(e.target.value);
              await getClients();
            }}
          />
          <div className="max-h-48 overflow-y-auto mt-4 space-y-2">
            {clients.map((client) => (
              <div
                key={client.id}
                className={`border rounded p-2 cursor-pointer ${
                  selectedClient?.id === client.id ? "bg-blue-100 border-blue-300" : "bg-white"
                } hover:bg-blue-50`}
                onClick={() => setSelectedClient(client)}
              >
                {client.name}
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-4">
            <button
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              onClick={() => setCurrentStep(1)}
            >
              Voltar
            </button>
            <button
              disabled={!selectedClient}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              onClick={() => setCurrentStep(3)}
            >
              Próximo
            </button>
          </div>
        </>
      );
    }

    if (currentStep === 3) {
      // CONFIRM STEP
      return (
        <>
          <div className="mb-4">
            <h2 className="font-semibold">Resumo</h2>
            <p><strong>Inventário:</strong> {selectedInventory?.name}</p>
            <p><strong>Cliente:</strong> {selectedClient?.name}</p>
            <ul className="list-disc pl-5 mt-2">
              {addedProducts.map(p => (
                <li key={p.productId}>{p.name} — {p.amount}</li>
              ))}
            </ul>
          </div>

          <div className="flex justify-between mt-4">
            <button
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              onClick={() => setCurrentStep(2)}
            >
              Voltar
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={submitAll}
            >
              {saveButtonText || "Confirmar envio"}
            </button>
          </div>
        </>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-[9999] text-black">
      <div className="w-[60vw] max-h-[90vh] overflow-y-auto p-6 bg-white rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h1 className="text-xl font-bold mb-4">{title || "Adicionar produtos ao inventário"}</h1>

        {renderStep()}
      </div>
    </div>
  );
}
