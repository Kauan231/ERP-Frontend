import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../components/css/pages/pages.css";
import PageTitle from "../components/utils/PageTitle";
import Table from "../components/table/Table";
import ModalWithInputs from "../components/utils/ModalWithInputs";
import Placeholder from "../assets/placeholder.svg";

function Inventory() {
  //Auth
  const { user, setUser } = useContext(AuthContext);

  //Manipulate items
  const [allInventories, setAllInventories] = useState([]);
  const [inventoriesToExclude, setInventoriesToExclude] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});

  //Transfer
  const [transferItems, setTransferItems] = useState();
  const [toInventory, setToInventory] = useState(undefined);
  const [transferWindowOpen, setTransferWindowOpen] = useState(false);

  //Pagination
  const [content, setContent] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  //Filter items
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [limit, setLimit] = useState(7);
  const [totalOfItems, setTotalOfItems] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    if (user?.token) {
      getTableData();
    }
  }, [user]);

  useEffect(() => {
    getTableData();
  }, [selectedFilters]);

  useEffect(() => {
    getTableData();
  }, [selectedFilters, currentPage, limit]);

  async function getTableData() {
    const skip = (currentPage - 1) * limit;
    let baseUrl = "https://localhost:7011/Inventory/InventoryItem/ReadAll";
    let skipAndLimit = `skip=${skip}&limit=${limit}`
    let filters = '?';
    selectedFilters.forEach((filter) => {
      filters +=  `inventoryIds=${filter.id}&`;
    })
    let resUrl = baseUrl + filters + skipAndLimit;

    const res = await fetch(resUrl, {
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

    let contentToAdd = result.allInventoryItems.map((item) => ({
      Checkbox: {
        type: "checkbox",
        id: item.id,
        productId: item.product.id
      },
      Name: {
        type: "label-image",
        text: item.product.name
      },
      Description: {
        type: "label",
        text: item.product.description
      },
      Amount: {
        type: "label",
        text: item.amount
      },
      Inventory: {
        type: "label-filter",
        text: item.inventory.name,
        id: item.inventory.id
      }
    })).filter(item => item.Amount.text > 0);

    setContent(contentToAdd);
    setAllInventories(result.allInventories.map(inv => ({ id: inv.id, text: inv.name })));
    setTotalOfItems(result.totalOfItems);
  }

  const headers = [
    {
      name: "Checkbox",
      size: "10%",
      type: "normal",
      checkedItems: checkedItems,
      setCheckedItems: setCheckedItems,
      actionButtons: () => (
        <>
          <button
            className="border p-2 rounded-full bg-white hover:bg-gray-200"
            onClick={() => setTransferWindowOpen(true)}
          >
            Transferir
          </button>
          <button
            className="border p-2 rounded-full bg-white hover:bg-gray-200"
            onClick={() => { setCheckedItems({}); }}>
            Desmarcar
          </button>
          <button className="border p-2 rounded-full bg-white hover:bg-gray-200">
            Remover
          </button>
        </>
      ),
      getCheckedItens: (items) => {
        setCheckedItems({ ...items });
        const Toexclude = Object.keys(items).reduce((acc, key) => {
          const found = content.find(cont => cont.Checkbox.id === key);
          if (found) acc.push(found.Inventory.id);
          return acc;
        }, []);
        setInventoriesToExclude(Toexclude);
      }
    },
    { name: "Name", size: "20%", type: "normal" },
    { name: "Description", size: "20%", type: "normal" },
    { name: "Amount", size: "20%", type: "normal" },
    {
      name: "Inventory",
      size: "20%",
      type: "filter",
      filters: allInventories,
      selectedFilters: selectedFilters,
      setSelectedFilters: setSelectedFilters,
      filterFromList: (filters) => {
        if (filters.length === 0) return content;
        return content.filter(content => filters.includes(content.Inventory.text));
      }
    }
  ];

  const Product = ({ product }) => {
    const [quantity, setQuantity] = useState(() => {
      const existing = transferItems?.[product.Checkbox.id]?.amount;
      return typeof existing === "number" ? existing : 0;
    });

    const updateTransferItem = (newQuantity) => {
      setTransferItems(prev => {
        const updated = { ...prev };
        updated[product.Checkbox.id] = {
          product,
          amount: newQuantity
        };
        return updated;
      });
    };

    const increment = () => {
      setQuantity(prev => {
        const updated = Math.min(prev + 1, Number(product.Amount.text));
        updateTransferItem(updated);
        return updated;
      });
    };

    const decrement = () => {
      setQuantity(prev => {
        const updated = Math.max(prev - 1, 0);
        updateTransferItem(updated);
        return updated;
      });
    };

    return (
      <div className="flex flex-row text-black w-full items-center justify-between pt-2">
        <div className="flex flex-row items-center">
          <img src={Placeholder} className="w-8" alt="placeholder" />
          <label className="ml-2" title={`${product.Name.text} ( ${product.Inventory.text} )`}>
            {`${product.Name.text} ( ${product.Inventory.text} )`}
          </label>
        </div>

        <div className="flex flex-row items-center gap-1">
          <button
            onClick={decrement}
            className="bg-red-300 px-2 rounded hover:bg-red-400"
          >
            −
          </button>
          <input
            type="number"
            value={quantity}
            readOnly
            className="bg-gray-200 border w-12 text-center rounded"
          />
          <button
            onClick={increment}
            className="bg-green-300 px-2 rounded hover:bg-green-400"
          >
            +
          </button>
        </div>
      </div>
    );
  };

  const ProductItems = () => {
    const items = Object.keys(checkedItems).map((item, index) => (
      <Product product={content.find(cont => cont.Checkbox.id === item)} key={index} />
    ));

    return (
      <div className="max-h-[28vh] overflow-y-auto">
        {items.length > 0 ? items : <p className="text-gray-500">Nenhum item selecionado</p>}
      </div>
    );
  };

  const transferItem = async (selectedInventory) => {
    const inventoryId = selectedInventory ?? toInventory;

    if (!inventoryId) {
      alert("Escolha um inventário");
      return;
    }

    if (!transferItems || Object.values(transferItems).some(item => item.amount === 0)) {
      alert("Você não pode transferir um item com quantidade 0.");
      return;
    }

    for (let item of Object.values(transferItems)) {
      const requestBody = {
        amount: item.amount,
        productId: item.product.Checkbox.productId,
        id: item.product.Checkbox.id,
        toInventoryId: inventoryId,
        fromInventoryId: item.product.Inventory.id
      };

      const res = await fetch("https://localhost:7011/Shipment/Transfer", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${JSON.parse(user.token).token}`
        }
      });

      if (!res.ok) {
        console.error("Erro na transferência:", res.status);
      }
    }

    setTransferWindowOpen(false);
    setTransferItems(undefined);
    setToInventory(undefined);
    setCheckedItems({});
    getTableData();
  };

  return (
    <>
      <div className='w-full h-full flex'>
        <div className='mainDiv'>
          <div className="mainInsideDiv">
            <PageTitle title="Inventarios" />
            <div className="flex flex-col w-full">
              <Table
                content={content}
                headers={headers}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={Math.ceil(totalOfItems / itemsPerPage)}
              />
            </div>
          </div>
        </div>
      </div>

      {transferWindowOpen && (
        <ModalWithInputs
          onClose={() => setTransferWindowOpen(false)}
          content={{
            title: "Transferir",
            saveButtonText: "Transferir",
            onSelectChange: setToInventory,
            onButtonClick: (selectedInventory) => transferItem(selectedInventory),
            inputs: [
              {
                name: "products",
                type: "custom",
                elements: ProductItems,
              },
              {
                name: "inventories",
                type: "dropdown",
                options: allInventories.filter(
                  (inv) => !inventoriesToExclude.includes(inv.id)
                ),
              },
            ],
          }}
        />
      )}
    </>
  );
}

export default Inventory;