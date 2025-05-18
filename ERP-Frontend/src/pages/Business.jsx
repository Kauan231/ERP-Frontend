import "../components/css/pages/pages.css"
import PageTitle from "../components/utils/PageTitle"
import BusinessDisplay from "../components/utils/BusinessDisplay"
import AddBusinessDisplay from "../components/utils/AddBusinessDisplay"

function Business() {
  return (
    <div className='w-full h-full flex'>
      <div className='mainDiv'>
        <div className="mainInsideDiv">
          <PageTitle title="Sua empresa"/>
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
