import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const viewDetails = () => {
    navigate(`/product/${product.id}`);
  };

  const addProductToCart = () => {
    addToCart(product);
    toast.success('Producto agregado al carrito');
  };

  const nextImage = () => {
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };
    
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG'
    }).format(value);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden card-shadow">
      <div className="relative">
        <img
          src={product.images[currentImageIndex] || 'https://placehold.co/300x200?text=Sin+Imagen'}
          className="w-full h-48 object-cover"
          alt="Imagen del producto"
        />
        {product.images && product.images.length > 1 && (
          <div className="absolute top-2 left-2 flex space-x-2">
            <button
              onClick={prevImage}
              className="bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button
              onClick={nextImage}
              className="bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        )}
        <div className="absolute bottom-2 right-2">
          <button
            onClick={viewDetails}
            className="rounded-full w-8 h-8 flex items-center justify-center transition-all"
                      style={{
                        backgroundColor: 'var(--color-text)',
                        color: 'white',
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-price)'} // Cambia el color al pasar el ratón
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--color-text)'}
          >
            <i className="fas fa-eye"></i>
          </button>
          <button
            onClick={addProductToCart}
            className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-green-600 transition"
          >
            <i className="fas fa-cart-plus"></i>
          </button>
        </div>
      </div>
      {/* HACER QUE AL TOCAR EL NOMBRE DEL PRODUCTO TE LLEVE A LA PAGINA DEL PRODUCTO */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-800 mb-2 cursor-pointer" onClick={viewDetails}>{product.name}</h3>
        <p className="text-price font-semibold text-xl mb-2 ">{formatCurrency(product.price)}</p>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="flex flex-wrap gap-1">
          {product.images.slice(1, 4).map((img, index) => (
            <span
              key={index}
              className="w-8 h-8 object-cover rounded border"
              style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover' }}
            ></span>
          ))}
          {product.images.length > 3 && (
            <span className="text-xs text-gray-500">
              +{product.images.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;