import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // ✅ Añade esta línea
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import config from '../config';

const ProductGridPage = () => {
  const { id } = useParams(); // ✅ Usa useParams para obtener el id
  const [products, setProducts] = useState([]);
  const [sectionName, setSectionName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await axios.get(`${config.API_BASE_URL}/api/sections/${id}/products`);
        setProducts(res.data);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Error al cargar los productos');
      }
    };

    const loadSectionName = async () => {
      try {
        const res = await axios.get(`${config.API_BASE_URL}/api/sections`);
        const section = res.data.find(s => s.id === id);
        if (section) {
          setSectionName(section.name);
        } else {
          setSectionName('Sección no encontrada');
        }
      } catch (err) {
        console.error('Error loading section name:', err);
        setSectionName('Error al cargar sección');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
    loadSectionName();
  }, [id]); // ✅ Asegúrate de que 'id' esté en la dependencia

  if (loading) {
    return <div className="text-center py-12">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <div className="section-page bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{sectionName}</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {products.length === 0 && (
          <p className="text-center text-gray-500 py-12">No hay productos en esta sección</p>
        )}
      </div>
    </div>
  );
};

export default ProductGridPage;