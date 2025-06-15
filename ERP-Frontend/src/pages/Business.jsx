
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { BusinessContext } from "../context/BusinessContext";

import "../components/css/pages/pages.css"
import PageTitle from "../components/utils/PageTitle"
import ItemDisplay from "../components/utils/ItemDisplay";
import Button from "../components/inputs/Button";
import ModalWithInputs from "../components/modals/ModalWithInputs";
import ModalConfirm from "../components/modals/ModalConfirm";

function Business() {
  //Auth
  const { user, setUser } = useContext(AuthContext);
  const { currentBusiness, setCurrentBusiness } = useContext(BusinessContext);

  const [businesses, setBusinesses] = useState([]);
  const [businessWindowOpen, setBusinessWindowOpen] = useState(false);
  const [deleteCompanyModalOpen, setDeleteCompanyModalOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState("");

  const getBusinesses = async() => {
    let baseUrl = "https://localhost:7011/User/Businesses";
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
    setBusinesses(result);
  }

  const saveBusiness = async(content) => {
    const name = content.refs[0].value;

    let baseUrl = "https://localhost:7011/Business?businessName="+name;
    const res = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${JSON.parse(user.token).token}`
      }
    });

    if (!res.ok) {
      console.error("Erro ao buscar dados:", res.status);
      return;
    }

    setBusinessWindowOpen(false);
    await getBusinesses();
  }

  const handleConfirm = async() => {
    let baseUrl = "https://localhost:7011/Business/"+companyToDelete;
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

    setCompanyToDelete("");
    setDeleteCompanyModalOpen(false);
    await getBusinesses();
  }

  useEffect(() => {
    if (user?.token) {
      getBusinesses();
    }
  }, [user]);


  return (
    <div className='w-full h-full flex'>
      <div className='mainDiv'>
        <div className="mainInsideDiv">
          <PageTitle title="Sua empresa"/>

          <div className="flex flex-col w-full gap-2">
            <div
                className="w-64 mb-2"
            >
                <Button
                  title={"Adicionar empresa"}
                  onClick={() => setBusinessWindowOpen(true)}
                />
            </div>
            <div className="flex flex-row w-full gap-2">
              {
                businesses.length > 0 &&
                businesses.map((business) => {
                  return (
                    <ItemDisplay
                      content={business}
                      onClick={() => {setCurrentBusiness(business.id)}}
                      onDelete={() => {
                        setCompanyToDelete(business.id);
                        setDeleteCompanyModalOpen(true);
                      }}
                      selected={currentBusiness == business.id}
                    />
                  )
                }
                )
              }
            </div>


          </div>
        </div>
      </div>

      {
        businessWindowOpen &&
        <ModalWithInputs
          onClose={() => setBusinessWindowOpen(false)}
          content={{
            title:"Adicionar empresa",
            onButtonClick: async (content) => await saveBusiness(content),
            inputs:[
              {
                name: "Nome",
                type: "normal"
              }
            ]
          }}
        />
      }

      { deleteCompanyModalOpen && (
                <ModalConfirm
                    onClose={() => setDeleteCompanyModalOpen(false)}
                    handleConfirm={async () => await handleConfirm()}
                    content={
                        {
                            title: "Remover Empresa",
                            subtitle: "Tem certeza que deseja remover a empresa?"
                        }
                    }
                />
            )}
    </div>
  )
}

export default Business
