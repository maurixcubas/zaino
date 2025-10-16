import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductGridPage from './pages/ProductGridPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar'; // ✅ Importa el navbar
import EditSectionPage from './pages/EditSectionPage';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <CartProvider>
      <ToastContainer />
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar /> {/* ✅ Añade el navbar aquí */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/section/:id" element={<ProductGridPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/section/:id/edit" element={<EditSectionPage />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;