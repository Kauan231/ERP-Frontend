import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";

import './index.css'
import Business from './Business.jsx'
import Sidepanel from './components/Sidepanel.jsx'

function App() {
  return (
    <div className='bg-gray w-screen h-screen flex'>
      <div className='w-64 h-full flex'>
          <Sidepanel />
      </div>
      <div className='bg-gray w-full h-full'>
        <BrowserRouter>
          <Routes>
            <Route path="/companies" element={<Business />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>

  )
}

export default App
