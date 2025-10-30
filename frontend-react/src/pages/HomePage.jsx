import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SectionCarousel from '../components/SectionCarousel';
import { useNavigate } from 'react-router-dom';
import config from '../config';

const HomePage = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const loadSections = async () => {
      try {
        const res = await axios.get(`${config.API_BASE_URL}/api/sections`);
        setSections(res.data);
      } catch (err) {
        console.error('Error loading sections:', err);
      }
    };

    const loadFeaturedProducts = async () => {
      try {
        const res = await axios.get(`${config.API_BASE_URL}/api/products/featured`);
        setFeaturedProducts(res.data.slice(0, 4));
      } catch (err) {
        console.error('Error loading featured products:', err);
      }
    };

    loadSections();
    loadFeaturedProducts();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG'
    }).format(value);
  };

  const viewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="  ">
      {/* Hero Section */}
      <div className="relative h-96 bg-cover bg-center" style={{ backgroundImage: 'url("https://zainostorage.blob.core.windows.net/imagenes/Gemini_Generated_Image_m3nwesm3nwesm3nw.png")' }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Bienvenido a Zaino</h1>
            <p className="text-xl mb-6">Tu tienda de carteras, mochilas y billeteras</p>
          </div>
        </div>
      </div>

      {/* Section Carousel */}
      <SectionCarousel sections={sections} />

      {/* Featured Products Section */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Productos Destacados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden card-shadow">
                <div className="relative">
                  <img
                    src={product.images[0] || 'https://placehold.co/300x200?text=Sin+Imagen'}
                    className="w-full h-48 object-cover object-center rounded-lg shadow"
                    alt="Imagen del producto"
                    
                  />
                  <div className="absolute bottom-2 right-2">
                    <Link
                      to={`/product/${product.id}`}
                      className="rounded-full w-8 h-8 flex items-center justify-center transition-all"
                      style={{
                        backgroundColor: 'var(--color-text)',
                        color: 'white',
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-price)'} // Cambia el color al pasar el ratón
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--color-text)'} // Restaura el color original al dejar el ratón
                    >
                      <i className="fas fa-eye"></i>  
                    </Link>
                  </div>
                </div>
                {/* HACER QUE AL TOCAR EL NOMBRE DEL PRODUCTO TE LLEVE A LA PAGINA DEL PRODUCTO */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-800 mb-2 cursor-pointer" onClick={() => viewDetails(product.id)}>{product.name}</h3>
                  <p className="text-price font-semibold text-xl mb-2">{formatCurrency(product.price)}</p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;