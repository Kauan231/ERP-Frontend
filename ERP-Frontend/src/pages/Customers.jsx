import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { BusinessContext } from "../context/BusinessContext";
import PageTitle from "../components/utils/PageTitle";
import ItemDisplay from "../components/utils/ItemDisplay";
import ModalWithInputs from "../components/modals/ModalWithInputs";
import { Pagination } from "../components/table/Pagination";
import ModalConfirm from "../components/modals/ModalConfirm";
import Input from "../components/inputs/Input";
import Button from "../components/inputs/Button";

function Customers() {
    //Auth
    const { user } = useContext(AuthContext);

    //Add product
    const { currentBusiness, businesses } = useContext(BusinessContext);

    const [clients, setClients] = useState([]);
    const [addClientWindowOpen, setAddClientWindowOpen] = useState(false);
    const [deleteProductWindowOpen, setDeleteClientWindowOpen] = useState(false);

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(12);
    const [totalOfItems, setTotalOfItems] = useState(1);
     const itemsPerPage = 12;

     //Remove product
    const [clientsToDelete, setClientToDelete] = useState(1);

    //Search
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (currentBusiness) {
            getClients();
        }
    }, [])


    useEffect(() => {
        getClients();
    }, [currentPage, limit, currentBusiness,  businesses]);

    const getClients = async () => {
        const skip = (currentPage - 1) * limit;
        let baseUrl = `https://localhost:7011/Business/${currentBusiness}/Clients?`;
        let skipAndLimit = `skip=${skip}&limit=${limit}`
        let searchQuery = `search=${search}&`;

        let resUrl = baseUrl + searchQuery + skipAndLimit;

        const res = await fetch(resUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${JSON.parse(user.token).token}`
            }
        });

        let results = await res.json();
        setTotalOfItems(results.totalOfItems)
        results = results.clients.map((client) => {
            client.subtitle = client.description;
            delete client.description;
            return client;
        });

        setClients(results);
    }

    const saveClient = async (content) => {
        let name = content.refs.find(item => item.name == "Nome do cliente").value;

        const res = await fetch(`https://localhost:7011/Business/${currentBusiness}/addClient?ClientName=${name}`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${JSON.parse(user.token).token}`
            }
        });

        if (!res.ok) {
            console.error("Erro ao adicionar item:", res.status);
        }

        setAddClientWindowOpen(false);
        await getClients();
    }

    const onDelete = (clientId) => {
        setClientToDelete(clientId);
        setDeleteClientWindowOpen(true);
    }

    const handleConfirm = async () => {
        const res = await fetch(`https://localhost:7011/Business/${currentBusiness}/Client/${clientsToDelete}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${JSON.parse(user.token).token}`
            }
        });

        await res;
        setDeleteClientWindowOpen(false);
        await getClients();
    }

    return (
        <div className='w-full h-full flex'>
            <div className='mainDiv'>
                <div className="mainInsideDiv">
                    <PageTitle title="Clientes" />
                    <div
                        className="flex flex-col gap-6 w-full"
                    >
                        <div
                            className="w-full flex justify-between items-center"
                        >
                            <div
                                className="w-[30vw] flex gap-2"
                            >
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder={"Digite o nome do cliente"}
                                />
                                <div
                                    className="w-[20vw]"
                                >
                                    <Button
                                        title={"Buscar por cliente"}
                                        onClick={() => {
                                            setCurrentPage(1);
                                            getClients();
                                        }}
                                    />
                                </div>

                            </div>

                            <div
                                className="w-[10vw]"
                            >
                                <Button
                                    title={"Adicionar cliente"}
                                    onClick={() => setAddClientWindowOpen(true)}
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 justify-start overflow-y-auto max-h-[80vh]">
                            {clients.map((product, index) => (
                                <ItemDisplay
                                    content={product}
                                    key={index}
                                    onDelete={onDelete}
                                />
                            ))}
                        </div>
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(totalOfItems / itemsPerPage)}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            </div>

            {addClientWindowOpen && (
                <ModalWithInputs
                onClose={() => setAddClientWindowOpen(false)}
                content={{
                    title: "Adicionar novo cliente",
                    saveButtonText: "Adicionar",
                    onButtonClick: async (content) => await saveClient(content),
                    inputs: [
                    {
                        name: "Nome do cliente",
                        type: "normal"
                    }
                    ],
                }}
                />
            )}
            {   deleteProductWindowOpen && (
                <ModalConfirm
                    onClose={() => setDeleteClientWindowOpen(false)}
                    handleConfirm={async () => await handleConfirm()}
                    content={
                        {
                            title: "Remover cliente",
                            subtitle: "Tem certeza que deseja remover o cliente?"
                        }
                    }
                />
            )}

        </div>
    )
}
export default Customers;