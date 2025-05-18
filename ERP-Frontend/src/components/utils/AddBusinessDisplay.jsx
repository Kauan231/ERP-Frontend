import { useState } from "react"
import ModalWithInputs from "../utils/ModalWithInputs";

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
        <ModalWithInputs
          onClose={() => setBusinessWindowOpen(false)}
          content={{
            title:"Adicionar empresa",
            inputs:[
              {
                name: "Name",
                type: "normal"
              }
            ]
          }}
        />
      }
    </>
  )
}

export default AddBusinessDisplay
