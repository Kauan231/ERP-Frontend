import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { BusinessProvider } from "./context/BusinessContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Sidepanel from './components/sidepanel/Sidepanel.jsx';
import Business from './pages/Business.jsx';
import Inventory from "./pages/Inventory.jsx";
import Products from "./pages/Products.jsx";
import Customers from "./pages/Customers.jsx";
import Shipments from "./pages/Shipments.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BusinessProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
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

            <Route path="/Products" element={
              <ProtectedRoute>
                  <div className="flex h-screen w-screen">
                    <Sidepanel />
                    <Products />
                  </div>
              </ProtectedRoute>
            } />

            <Route path="/Customers" element={
              <ProtectedRoute>
                  <div className="flex h-screen w-screen">
                    <Sidepanel />
                    <Customers />
                  </div>
              </ProtectedRoute>
            } />

            <Route path="/Shipments" element={
              <ProtectedRoute>
                  <div className="flex h-screen w-screen">
                    <Sidepanel />
                    <Shipments />
                  </div>
              </ProtectedRoute>
            } />
          </Routes>
        </BusinessProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
