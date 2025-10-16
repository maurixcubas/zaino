import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [sections, setSections] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imageUploadUrl, setImageUploadUrl] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    description: '',
    images: [],
    section_id: ''
  });
  const [newSection, setNewSection] = useState({
    id: '',
    name: '',
    image: ''
  });

  useEffect(() => {
    verifyToken();
    loadProducts();
    loadSections();
  }, []);

  const verifyToken = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      window.location.href = '/admin/login';
    }
  };

  const loadProducts = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Error loading products:', err);
      setMessage('Error al cargar productos');
    }
  };

  const loadSections = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/sections');
      setSections(res.data);
    } catch (err) {
      console.error('Error loading sections:', err);
      setMessage('Error al cargar secciones');
    }
  };

  const addProduct = async () => {
    if (newProduct.images.length === 0) {
      setMessage('Debes subir al menos una imagen');
      return;
    }

    try {
      const productId = editingProduct ? editingProduct.id : `prod-${Date.now()}`;
      const productData = {
        ...newProduct,
        id: productId
      };

      if (editingProduct) {
        await axios.put(`http://127.0.0.1:5000/api/products/${editingProduct.id}`, productData);
        setMessage('Producto actualizado correctamente');
      } else {
        await axios.post('http://127.0.0.1:5000/api/products', productData);
        setMessage('Producto agregado correctamente');
      }

      setShowProductForm(false);
      setEditingProduct(null);
      loadProducts();
      resetProductForm();
    } catch (err) {
      setMessage('Error al guardar producto');
    }
  };

  const deleteProduct = async (id) => {
    if (confirm('¿Eliminar este producto?')) {
      try {
        await axios.delete(`http://127.0.0.1:5000/api/products/${id}`);
        setMessage('Producto eliminado correctamente');
        loadProducts();
      } catch (err) {
        setMessage('Error al eliminar producto');
      }
    }
  };

  const editProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price,
      description: product.description,
      images: product.images,
      section_id: product.section_id
    });
    setShowProductForm(true);
    // SCROLL TO TOP
    window.scrollTo(0, 0);
  };

  const addSection = async () => {
    try {
      const sectionData = {
        ...newSection
      };

      if (editingSection) {
        await axios.put(`http://127.0.0.1:5000/api/sections/${editingSection.id}`, sectionData);
        setMessage('Sección actualizada correctamente');
      } else {
        await axios.post('http://127.0.0.1:5000/api/sections', sectionData);
        setMessage('Sección agregada correctamente');
      }

      setShowSectionForm(false);
      setEditingSection(null);
      loadSections();
      resetSectionForm();
    } catch (err) {
      setMessage('Error al guardar sección');
    }
  };

  const deleteSection = async (id) => {
    if (confirm('¿Eliminar esta sección?')) {
      try {
        await axios.delete(`http://127.0.0.1:5000/api/sections/${id}`);
        setMessage('Sección eliminada correctamente');
        loadSections();
      } catch (err) {
        setMessage('Error al eliminar sección');
      }
    }
  };

  const editSection = (section) => {
    setEditingSection(section);
    setNewSection({
      id: section.id,
      name: section.name,
      image: section.image
    });
    setShowSectionForm(true);
  };

  const uploadImage = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('http://127.0.0.1:5000/api/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setImageUploadUrl(res.data.url);
    } catch (err) {
      alert('Error al subir imagen');
    } finally {
      setUploading(false);
    }
  };

  const addImageUrl = () => {
    if (imageUploadUrl && !newProduct.images.includes(imageUploadUrl)) {
      setNewProduct(prev => ({
        ...prev,
        images: [...prev.images, imageUploadUrl]
      }));
      setImageUploadUrl('');
    }
  };

  const removeImage = (index) => {
    setNewProduct(prev => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
  };

  const addSectionImageUrl = () => {
    if (imageUploadUrl) {
      setNewSection(prev => ({
        ...prev,
        image: imageUploadUrl
      }));
      setImageUploadUrl('');
    }
  };

  const resetProductForm = () => {
    setNewProduct({
      name: '',
      price: 0,
      description: '',
      images: [],
      section_id: ''
    });
    setEditingProduct(null);
    setImageUploadUrl('');
  };

  const resetSectionForm = () => {
    setNewSection({
      id: '',
      name: '',
      image: ''
    });
    setEditingSection(null);
    setImageUploadUrl('');
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG'
    }).format(value);
  };

  return (
    <div className="admin-panel p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">
          Cerrar Sesión
        </button>
      </div>

      {message && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-700">
          {message}
        </div>
      )}

      <div className="mb-6 border-b">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 mr-2 ${activeTab === 'products' ? 'border-b-2 border-blue-500' : 'text-gray-500 hover:text-blue-500'}`}
        >
          Productos
        </button>
        <button
          onClick={() => setActiveTab('sections')}
          className={`px-4 py-2 ${activeTab === 'sections' ? 'border-b-2 border-blue-500' : 'text-gray-500 hover:text-blue-500'}`}
        >
          Secciones
        </button>
      </div>

      {activeTab === 'products' && (
        <>
          <div className="mb-6">
            <button
              onClick={() => { setShowProductForm(true); setEditingProduct(null); }}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Agregar Producto
            </button>
          </div>

          {showProductForm && (
            <div className="mb-8 p-4 bg-gray-100 rounded">
              <h2 className="text-xl font-bold mb-4">{editingProduct ? 'Editar Producto' : 'Agregar Producto'}</h2>
              <form onSubmit={(e) => { e.preventDefault(); addProduct(); }}>
                <div className="mb-4">
                  <input
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="Nombre del producto"
                    className="w-full px-3 py-2 border rounded mb-2"
                    required
                  />
                  <input
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                    type="number"
                    placeholder="Precio"
                    className="w-full px-3 py-2 border rounded mb-2"
                    required
                  />
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    placeholder="Descripción"
                    className="w-full px-3 py-2 border rounded mb-2"
                    required
                  ></textarea>

                  {/* Subida de imágenes */}
                  <div className="mb-2">
                    <label className="block text-gray-700 mb-1">Imágenes</label>
                    <input
                      type="file"
                      onChange={uploadImage}
                      accept="image/*"
                      className="w-full px-3 py-2 border rounded mb-2"
                    />
                    {uploading && <div className="text-blue-500 mt-2">Subiendo...</div>}

                    {/* Vista previa de imagen subida */}
                    {imageUploadUrl && (
                      <div className="mt-2 flex items-center">
                        <img src={imageUploadUrl} className="w-16 h-16 object-cover rounded shadow" />
                        <button
                          onClick={addImageUrl}
                          className="ml-2 bg-green-500 text-white px-2 py-1 rounded text-sm"
                        >
                          Agregar
                        </button>
                      </div>
                    )}

                    {/* Lista de imágenes subidas */}
                    {newProduct.images.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Imágenes seleccionadas:</h3>
                        <div className="flex flex-wrap gap-2">
                          {newProduct.images.map((img, index) => (
                            <div key={index} className="relative group">
                              <img src={img} className="w-16 h-16 object-cover rounded shadow" />
                              <button
                                onClick={() => removeImage(index)}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Mensaje de error si no hay imágenes */}
                    {newProduct.images.length === 0 && (
                      <div className="text-red-500 text-sm mt-2">
                        Debes subir al menos una imagen
                      </div>
                    )}
                  </div>

                  <select
                    value={newProduct.section_id}
                    onChange={(e) => setNewProduct({...newProduct, section_id: e.target.value})}
                    className="w-full px-3 py-2 border rounded mb-2"
                    required
                  >
                    <option value="">Selecciona una sección</option>
                    {sections.map(section => (
                      <option key={section.id} value={section.id}>
                        {section.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={newProduct.images.length === 0}
                  className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {editingProduct ? 'Actualizar Producto' : 'Guardar Producto'}
                </button>
                <button
                  onClick={() => { setShowProductForm(false); resetProductForm(); }}
                  className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancelar
                </button>
              </form>
            </div>
          )}

          {/* Productos Actuales - Vista en Grid */}
          <div>
            <h2 className="text-xl font-bold mb-4">Productos Actuales</h2>
            {products.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No hay productos</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                  <div 
                    key={product.id} 
                    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Imagen del producto */}
                    <div className="relative">
                      <img
                        src={product.images[0] || 'https://placehold.co/300x200?text=Sin+Imagen'}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      {/* Miniaturas de otras imágenes */}
                      {product.images.length > 1 && (
                        <div className="absolute bottom-2 left-2 flex space-x-1">
                          {product.images.slice(1, 4).map((img, index) => (
                            <img
                              key={index}
                              src={img}
                              alt=""
                              className="w-8 h-8 object-cover rounded border-2 border-white shadow"
                            />
                          ))}
                          {product.images.length > 4 && (
                            <div className="w-8 h-8 bg-black bg-opacity-50 text-white text-xs rounded flex items-center justify-center border-2 border-white shadow">
                              +{product.images.length - 4}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Información del producto */}
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-800 mb-1 truncate">{product.name}</h3>
                      <p className="text-price font-semibold text-xl mb-2">{formatCurrency(product.price)}</p>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                      
                      {/* Sección e ID del producto */}
                      <div className="mb-3 flex gap-2 flex-wrap">
                        <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          {sections.find(s => s.id === product.section_id)?.name || product.section_id}
                        </span>
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          ID: {product.id}
                        </span>
                      </div>

                      {/* Botones de acción */}
                      <div className="flex justify-between pt-2 border-t border-gray-100">
                        <button
                          onClick={() => editProduct(product)}
                          className="text-blue-500 hover:text-blue-700 flex items-center text-sm"
                        >
                          <i className="fas fa-edit mr-1"></i> Editar
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-500 hover:text-red-700 flex items-center text-sm"
                        >
                          <i className="fas fa-trash mr-1"></i> Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'sections' && (
        <>
          <div className="mb-6">
            <button
              onClick={() => { setShowSectionForm(true); setEditingSection(null); }}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Agregar Sección
            </button>
          </div>

          {showSectionForm && (
            <div className="mb-8 p-4 bg-gray-100 rounded">
              <h2 className="text-xl font-bold mb-4">{editingSection ? 'Editar Sección' : 'Agregar Sección'}</h2>
              <form onSubmit={(e) => { e.preventDefault(); addSection(); }}>
                <div className="mb-4">
                  <input
                    value={newSection.id}
                    onChange={(e) => setNewSection({...newSection, id: e.target.value})}
                    placeholder="ID de la sección (ej: carteras)"
                    className="w-full px-3 py-2 border rounded mb-2"
                    required
                  />
                  <input
                    value={newSection.name}
                    onChange={(e) => setNewSection({...newSection, name: e.target.value})}
                    placeholder="Nombre de la sección (ej: Carteras)"
                    className="w-full px-3 py-2 border rounded mb-2"
                    required
                  />
                  
                  {/* Subida de imagen de sección */}
                  <div className="mb-2">
                    <label className="block text-gray-700 mb-1">Imagen de la sección</label>
                    <input
                      type="file"
                      onChange={uploadImage}
                      accept="image/*"
                      className="w-full px-3 py-2 border rounded mb-2"
                    />
                    {uploading && <div className="text-blue-500 mt-2">Subiendo...</div>}

                    {/* Vista previa de imagen subida */}
                    {imageUploadUrl && (
                      <div className="mt-2 flex items-center">
                        <img src={imageUploadUrl} className="w-16 h-16 object-cover rounded shadow" />
                        <button
                          onClick={addSectionImageUrl}
                          className="ml-2 bg-green-500 text-white px-2 py-1 rounded text-sm"
                        >
                          Agregar
                        </button>
                      </div>
                    )}

                    {/* Imagen actual de la sección */}
                    {newSection.image && (
                      <div className="mt-2">
                        <img src={newSection.image} className="w-16 h-16 object-cover rounded shadow" />
                        <button
                          onClick={() => setNewSection(prev => ({ ...prev, image: '' }))}
                          className="ml-2 bg-red-500 text-white px-2 py-1 rounded text-sm"
                        >
                          Quitar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {editingSection ? 'Actualizar Sección' : 'Guardar Sección'}
                </button>
                <button
                  onClick={() => { setShowSectionForm(false); resetSectionForm(); }}
                  className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancelar
                </button>
              </form>
            </div>
          )}

          {/* Secciones Actuales */}
          <div>
            <h2 className="text-xl font-bold mb-4">Secciones Actuales</h2>
            {sections.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No hay secciones</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sections.map(section => (
                  <div 
                    key={section.id} 
                    className="bg-white rounded-lg shadow p-4 flex justify-between items-center border border-gray-200"
                  >
                    <div>
                      <h3 className="font-bold text-lg">{section.name}</h3>
                      <p className="text-gray-500 text-sm">ID: {section.id}</p>
                      {section.image && (
                        <img src={section.image} className="w-16 h-16 object-cover rounded mt-2" />
                      )}
                    </div>
                    <div>
                      <button
                        onClick={() => editSection(section)}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => deleteSection(section.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPanel;