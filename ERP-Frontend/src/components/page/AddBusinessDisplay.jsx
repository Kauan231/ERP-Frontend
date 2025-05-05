import { useState } from "react"
import AddNewItem from "../utils/AddNewItem";

function AddBusinessDisplay({title}) {
  const [businessWindowOpen, setBusinessWindowOpen] = useState(false);
  return (
    <>
      <div
        className="w-60 p-5 bg-black rounded flex flex-col justify-center text-center"
        onClick={() => setBusinessWindowOpen(true)}
      >
        <h1
        className="text-4xl font-extrabold"
        >+</h1>
      </div>
      {
        businessWindowOpen &&
        <AddNewItem
          onClose={() => setBusinessWindowOpen(false)}
          content={{
            title:"Adicionar empresa",
            inputs:[
              {
                inputName: "Nome"
              }
            ]
          }}
        />
      }
    </>
  )
}

export default AddBusinessDisplay
