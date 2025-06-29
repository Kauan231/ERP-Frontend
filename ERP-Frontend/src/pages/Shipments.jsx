import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { BusinessContext } from "../context/BusinessContext";
import "../components/css/pages/pages.css";
import PageTitle from "../components/utils/PageTitle";
import Table from "../components/table/Table";
import Button from "../components/inputs/Button";
import ModalReceiveProducts from "../components/modals/ModalReceiveProducts";
import ModalSendProducts from "../components/modals/ModalSendProducts";

function Shipments() {
  //Auth
  const { user, setUser } = useContext(AuthContext);
  const { currentBusiness } = useContext(BusinessContext);

  //Pagination
  const [content, setContent] = useState([]);
  const [limit, setLimit] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [totalOfItems, setTotalOfItems] = useState(1);

  //Filter items
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [search, setSearch] = useState("");

  //Receive product
  const [isModalReceiveProductOpen, setIsModalReceiveProductOpen] = useState(false);

  //Send product
  const [isModalSendProductsOpen, setIsModalSendProductsOpen] = useState(false);

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
  }, [currentPage, limit, search, isModalSendProductsOpen, isModalReceiveProductOpen]);

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
      Sender: {
        type: "label",
        text: item.type == "RECEIVE" ? item.client : "--",
      },
      Receiver: {
        type: "label",
        text: item.type == "SEND" ? item.client : "--",
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
                  {
                    item.type == "SEND" &&
                    <>
                    <label>Vindo de: </label>
                    <label
                      className="font-semibold"
                    > { orderItem.inventoryFromName || "--"}
                    </label>
                    </>
                  }
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
    { name: "Status", size: "20%", type: "normal" },
    { name: "Type", size: "20%", type: "normal" },
    { name: "Sender", size: "20%", type: "normal" },
    { name: "Receiver", size: "20%", type: "normal" },
    { name: "Date", size: "20%", type: "normal" },
    {
      name: "Items",
      size: "20%",
      type: "custom",
    }
  ];

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

            <div>
              <Button
                title="Enviar produtos"
                onClick={() => setIsModalSendProductsOpen(true)}
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

      {
        isModalReceiveProductOpen &&

        <ModalReceiveProducts
          title="Receber produtos de fornecedor"
          onClose={() => setIsModalReceiveProductOpen(false)}
        />
      }

      {
        isModalSendProductsOpen &&

        <ModalSendProducts
          title="Enviar produtos"
          onClose={() => { setIsModalSendProductsOpen(false) }}
        />
      }
    </>
  );
}

export default Shipments;