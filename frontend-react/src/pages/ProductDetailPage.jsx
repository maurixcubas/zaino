import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext'; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetailPage = () => {
  const { addToCart } = useCart();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:5000/api/products/${id}`);
        setProduct(res.data);
        setCurrentImageIndex(0);
      } catch (err) {
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  
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
  
  const handleAddToCart = () => {
    addToCart(product); // ✅ Agrega el producto completo
    toast.success('Producto agregado al carrito');
  };
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG'
    }).format(value);
  };
  if (loading) {
    return <div className="text-center py-12">Cargando...</div>;
  }

  return (
    <div className="product-detail p-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Botón de volver */}
            <div className="mt-6">
              <button
                onClick={() => navigate(-1)}
                className="text-blue-500 hover:text-blue-700 flex items-center"
              >
                <i className="fas fa-arrow-left mr-2"></i> Volver
              </button>
            </div>
        {/* Imagen principal */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Carrusel de imágenes */}
          <div className="lg:w-1/2">
            <div className="relative">
              <img
                src={product.images?.[currentImageIndex] || 'https://placehold.co/600x600?text=Sin+Imagen'}
                alt={product.name}
                className="w-full h-auto object-cover rounded-lg shadow-lg"
              />
              {/* Flechitas para navegar entre imágenes */}
              {product.images && product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 text-black rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-100 transition"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 text-black rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-100 transition"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </>
              )}
            </div>

            {/* Miniaturas de imágenes */}
            {product.images && product.images.length > 1 && (
              <div className="flex flex-wrap mt-4 gap-2">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Miniatura ${index + 1}`}
                    className={`w-16 h-16 object-cover rounded cursor-pointer ${
                      index === currentImageIndex ? 'border-2 border-blue-500' : 'border border-gray-300'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className="lg:w-1/2">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-2xl font-bold text-price mb-6">{formatCurrency(product.price)}</p>

            {/* Botón de agregar al carrito */}
            <button
              onClick={handleAddToCart}
              className="bg-beige-dark hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition duration-300 w-full md:w-auto"
            >
              Agregar al carrito
            </button>

            {/* Sección de detalles adicionales */}
            <div className="mt-8 p-4 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Detalles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>Sección:</strong> {product.section_id}
                </div>
                <div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Descripción adicional */}
        {/* {product.description && (
          <div className="mt-12 p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Descripción detallada</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default ProductDetailPage;