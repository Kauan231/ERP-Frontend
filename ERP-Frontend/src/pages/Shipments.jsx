import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { BusinessContext } from "../context/BusinessContext";
import "../components/css/pages/pages.css";
import PageTitle from "../components/utils/PageTitle";
import Table from "../components/table/Table";
import ModalWithInputs from "../components/modals/ModalWithInputs";
import Button from "../components/inputs/Button";
import Placeholder from "../assets/placeholder.svg";
import ModalConfirm from "../components/modals/ModalConfirm";
import ModalSearchProduct from "../components/modals/ModalSearchProduct";
import ModalRemoveInventory from "../components/modals/ModalRemoveInventory";
import { useParams } from "react-router-dom";
import ModalReceiveProducts from "../components/modals/ModalReceiveProducts";

function Shipments() {
  //Auth
  const { user, setUser } = useContext(AuthContext);
  const { currentBusiness } = useContext(BusinessContext);

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
  const [limit, setLimit] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [totalOfItems, setTotalOfItems] = useState(1);

  //Filter items
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [search, setSearch] = useState("");

  //Remove Item
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);

  //Add item
  const [isModalReceiveProductOpen, setIsModalReceiveProductOpen] = useState(false);

  //Add inventory
  const [IsModalNewInventoryOpen, setIsModalNewInventoryOpen] = useState(false);
  const [businesses, setBusinesses] = useState([]);

  //Remove Inventory
  const [isModalRemoveInventoryOpen, setIsModalRemoveInventoryOpen] = useState(false);

  //Shipments
  const { productId } = useParams();

  useEffect(() => {
    if (user?.token && currentBusiness != undefined) {
      getTableData();
    }
  }, [user]);


  useEffect(() => {
    if (user?.token && currentBusiness != undefined) {
      getTableData();
    }
  }, [currentBusiness]);

  useEffect(() => {
    if(currentBusiness != undefined) {
      setCurrentPage(1);
      getTableData();
    }
  }, [selectedFilters, isModalReceiveProductOpen]);

  useEffect(() => {
    if(currentBusiness != undefined) {
      getTableData();
    }
  }, [currentPage, limit, search]);

  const onSearch = (search) => {
    setSearch(search);
  }

  async function getTableData() {


    const skip = (currentPage - 1) * limit;
    let baseUrl = `https://localhost:7011/Shipment?businessId=${currentBusiness}`;
    let skipAndLimit = `skip=${skip}&limit=${limit}`
    let searchQuery = `&search=${search}&`;
    let resUrl = baseUrl + searchQuery + skipAndLimit;

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

    let contentToAdd = result.shipments.map((item) => ({
      Checkbox: {
        type: "checkbox",
        id: item.id,
        productId: item.id
      },
      Status: {
        type: "label",
        text: item.status,
      },
      Type: {
        type: "label",
        text: item.type,
      },
      Date: {
        type: "label",
        text: new Date(item.date).toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        })
      },
      Items: {
        type: "custom",
        content: () => (
          <ul>
            {item.orderItems.map((orderItem, idx) => (
              <div
                className="flex flex-col mb-2"
              >
                <div
                  className={`flex flex-row gap-2 ${idx != 0 ? 'pt-2 border-t-2' : '' }`}
                >
                  <label>Produto: </label>
                  <label
                    className="font-semibold"
                  > {orderItem.productName ?? "Unnamed Product"} </label>
                </div>

                <div
                  className="flex flex-row gap-2"
                >
                  <label>Quantia: </label>
                  <label
                    className="font-semibold"
                  > {orderItem.amount ?? "--"} </label>
                </div>

                <div
                  className="flex flex-row gap-2"
                >
                  <label>Vindo de: </label>
                  <label
                    className="font-semibold"
                  > {orderItem.inventoryFromName ?? "--"} </label>
                </div>
              </div>

            ))}
          </ul>
        ),
      },
    }));

    setContent(contentToAdd);
    //setAllInventories(result.allInventories.map(inv => ({ id: inv.id, text: inv.name })));
    setTotalOfItems(result.totalOfItems);
  }

  const headers = [
    {
      name: "Checkbox",
      size: "10%",
      type: "normal",
      checkedItems: checkedItems
    },
    { name: "Status", size: "20%", type: "normal" },
    { name: "Type", size: "20%", type: "normal" },
    { name: "Date", size: "20%", type: "normal" },
    {
      name: "Items",
      size: "20%",
      type: "custom",
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

    const orderItemsToSend = Object.values(transferItems).map((item) => {
      return {
        amount: item.amount,
        productId: item.product.Checkbox.productId,
        id: item.product.Checkbox.id,
        toInventoryId: inventoryId,
        fromInventoryId: item.product.Inventory.id
      }
    })

    const requestBody = {
      transferDtos: orderItemsToSend,
      toInventoryId: inventoryId
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

    setTransferWindowOpen(false);
    setTransferItems(undefined);
    setToInventory(undefined);
    setCheckedItems({});
    await getTableData();
  };

  const removeItems = async() => {
    let inventoryIds = Object.keys(checkedItems);

    const res = await fetch("https://localhost:7011/Inventory/InventoryItem/DeleteMany", {
      method: "POST",
      body: JSON.stringify(inventoryIds),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${JSON.parse(user.token).token}`
      }
    });

    if (!res.ok) {
      console.error("Erro na remover:", res.status);
    }

    setCheckedItems({});
    setIsModalConfirmOpen(false);
    await getTableData()
  }

  const SaveInventory= async (content) => {
    let inventoryName = content.refs[0].value;
    let businessId = businesses[0].id;

    let body = {
      name: inventoryName,
      businessId: businessId
    }

    const res = await fetch("https://localhost:7011/Inventory", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${JSON.parse(user.token).token}`
      }
    });

    if (!res.ok) {
      console.error("Erro na remover:", res.status);
    }

    setIsModalNewInventoryOpen(false);
    await getTableData()
  }

  return (
    <>
      <div className='w-full h-full flex'>
        <div className='mainDiv'>
          <div className="mainInsideDiv">
            <PageTitle title="Transferencias" />

            <div className="w-full pb-8 flex flex-wrap gap-6 items-start">

            <div>
              <Button
                title="Receber produtos de fornecedor"
                onClick={() => setIsModalReceiveProductOpen(true)}
              />
            </div>

          </div>

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
            onButtonClick: (inputData) => transferItem(inputData.selectedDropdown),
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

      { isModalConfirmOpen &&
        <ModalConfirm
          onClose={() => setIsModalConfirmOpen(false)}
          handleConfirm={async () => await removeItems()}
          content={
              {
                  title: "Remover produto",
                  subtitle: "Tem certeza que deseja remover o produto?"
              }
          }
        />

      }

      {
        isModalReceiveProductOpen &&

        <ModalReceiveProducts
          title="Adicionar produto a inventário"
          onClose={() => setIsModalReceiveProductOpen(false)}
        />
      }

      {
        IsModalNewInventoryOpen &&
          <ModalWithInputs
            onClose={() => setIsModalNewInventoryOpen(false)}
            content={{
              title: "Adicionar inventário",
              saveButtonText: "Salvar",
              onButtonClick: async (content) => await SaveInventory(content),
              inputs: [
                {
                  name: "Nome do inventário",
                  type: "normal"
                }
              ],
            }}
          />
      }

      {
        isModalRemoveInventoryOpen &&
          <ModalRemoveInventory
            onClose={async () => {
              setIsModalRemoveInventoryOpen(false);
              setSelectedFilters([]);
              setCurrentPage(1);
              await getTableData();
            }}
          />
      }

    </>
  );
}

export default Shipments;