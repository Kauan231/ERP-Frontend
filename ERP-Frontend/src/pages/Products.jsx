import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { BusinessContext } from "../context/BusinessContext";
import PageTitle from "../components/utils/PageTitle";
import ItemDisplay from "../components/utils/ItemDisplay";
import ModalWithInputs from "../components/utils/ModalWithInputs";
import { Pagination } from "../components/utils/Pagination";
import ModalConfirm from "../components/utils/ModalConfirm";

function Products() {
    //Auth
    const { user } = useContext(AuthContext);

    //Add product
    const { currentBusiness } = useContext(BusinessContext);
    const [products, setProducts] = useState([]);
    const [addProductWindowOpen, setAddProductWindowOpen] = useState(false);
    const [deleteProductWindowOpen, setDeleteProductWindowOpen] = useState(false);

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(12);
    const [totalOfItems, setTotalOfItems] = useState(1);
     const itemsPerPage = 12;

     //Remove product
    const [productToDelete, setProductToDelete] = useState(1);

    useEffect(() => {
        getProducts();
    }, [currentPage, limit]);


    const getProducts = async () => {
        const skip = (currentPage - 1) * limit;
        let baseUrl = "https://localhost:7011/Product?";
        let skipAndLimit = `skip=${skip}&limit=${limit}`
        let resUrl = baseUrl + skipAndLimit;

        const res = await fetch(resUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${JSON.parse(user.token).token}`
            }
        });

        let results = await res.json();

        setTotalOfItems(results.totalOfItems)

        results = results.allProducts.map((result) => {
            result.subtitle = result.description;
            delete result.description;
            return result;
        });

        setProducts(results);

    }

    const saveProduct = async (content) => {
        let name = content.refs.find(item => item.name == "Nome do produto").value;
        let description = content.refs.find(item => item.name == "Descrição").value;
        let businessId = currentBusiness;
        const requestBody = {
            name,
            description,
            businessId
        };

        const res = await fetch("https://localhost:7011/Product", {
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

        setAddProductWindowOpen(false);
        await getProducts();
    }

    const onDelete = (productId) => {
        setProductToDelete(productId);
        setDeleteProductWindowOpen(true);
    }

    const handleConfirm = async () => {
        const res = await fetch(`https://localhost:7011/Product/${productToDelete}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${JSON.parse(user.token).token}`
            }
        });

        await res;
        setDeleteProductWindowOpen(false);
        await getProducts();
    }

    useEffect(() => {
        getProducts()
    }, [])

    return (
        <div className='w-full h-full flex'>
            <div className='mainDiv'>
                <div className="mainInsideDiv">
                    <PageTitle title="Products" />
                    <div
                        className="flex flex-col gap-6"
                    >
                        <div
                            className="w-full"
                        >
                            <button
                                className="text-white font-semibold rounded-lg p-2 bg-blue-600 hover:opacity-90"
                                onClick={() => setAddProductWindowOpen(true)}
                            >
                                Adicionar produto
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-4 justify-start overflow-y-auto max-h-[80vh]">
                            {products.map((product, index) => (
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

            {addProductWindowOpen && (
                <ModalWithInputs
                onClose={() => setAddProductWindowOpen(false)}
                content={{
                    title: "Adicionar novo item",
                    saveButtonText: "Adicionar",
                    onButtonClick: async (content) => await saveProduct(content),
                    inputs: [
                    {
                        name: "Nome do produto",
                        type: "normal"
                    },
                    {
                        name: "Descrição",
                        type: "normal"
                    }
                    ],
                }}
                />
            )}
            {   deleteProductWindowOpen && (
                <ModalConfirm
                    onClose={() => setDeleteProductWindowOpen(false)}
                    handleConfirm={async () => await handleConfirm()}
                    content={
                        {
                            title: "Remover produto",
                            subtitle: "Tem certeza que deseja remover o produto?"
                        }
                    }
                />
            )}

        </div>
    )
}
export default Products;