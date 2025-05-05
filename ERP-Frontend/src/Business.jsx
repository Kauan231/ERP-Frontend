import "./components/css/pages/pages.css"
import PageTitle from "./components/page/PageTitle"
import BusinessDisplay from "./components/page/BusinessDisplay"
import AddBusinessDisplay from "./components/page/AddBusinessDisplay"

function Business() {
  return (
    <div className='w-full h-full flex'>
      <div className='mainDiv'>
        <div className="mainInsideDiv">
          <PageTitle title="Empresas"/>
          <div className="flex flex-row w-full gap-2">
            <BusinessDisplay title={"Empresa"}/>
            <AddBusinessDisplay />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Business
