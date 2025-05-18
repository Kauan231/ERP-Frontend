import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Sidepanel from './components/sidepanel/Sidepanel.jsx';
import Business from './pages/Business.jsx';
import Inventory from "./pages/Inventory.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <div className="flex h-screen w-screen">
                <Sidepanel />
                <Business />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/inventories" element={
            <ProtectedRoute>
              <div className="flex h-screen w-screen">
                <Sidepanel />
                <Inventory />
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
