import "./css/components/sidepanel.css"
import { sidebarDictionary } from "./translations/sidepanel"

function Sidepanel() {
  const language = "Portuguese";
  return (
    <aside class="w-64 bg-blue-800 text-white flex flex-col">
      <div class="p-6 text-2xl font-bold border-b border-blue-700">
        {sidebarDictionary.title[language]}
      </div>
      <nav class="flex-1 p-4 space-y-4">
        {
          sidebarDictionary.buttons.map((button, index) => {return <a href={button.href} key={index} class="block hover:bg-blue-700 rounded px-4 py-2">{button[language]}</a> })
        }
      </nav>
  </aside>
  )
}

export default Sidepanel
