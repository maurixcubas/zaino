import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-beige-dark text-beige-light p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold hover:text-beige-darker transition">
          Zaino
        </Link>
        <div className="flex space-x-6">
          <Link to="/cart" className="hover:text-beige-darker transition">
            🛒 Carrito
          </Link>
          <Link to="/admin/login" className="hover:text-beige-darker transition">
            🔐 Admin
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;