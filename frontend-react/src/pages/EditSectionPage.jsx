import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditSectionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [section, setSection] = useState({ name: '', image: '' });
  const [uploading, setUploading] = useState(false);
  const [imageUploadUrl, setImageUploadUrl] = useState('');

  useEffect(() => {
    const loadSection = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:5000/api/sections/${id}`);
        setSection(res.data);
      } catch (err) {
        console.error('Error loading section:', err);
      }
    };

    loadSection();
  }, [id]);

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
    if (imageUploadUrl && !section.image) {
      setSection(prev => ({ ...prev, image: imageUploadUrl }));
      setImageUploadUrl('');
    }
  };

  const removeImage = () => {
    setSection(prev => ({ ...prev, image: '' }));
  };

  const updateSection = async () => {
    try {
      await axios.put(`http://127.0.0.1:5000/api/sections/${id}`, section);
      navigate(`/section/${id}`);
    } catch (err) {
      alert('Error al actualizar sección');
    }
  };

  return (
    <div className="edit-section p-8">
      <h1 className="text-2xl font-bold mb-6">Editar Sección</h1>
      <form onSubmit={(e) => { e.preventDefault(); updateSection(); }}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Nombre</label>
          <input
            value={section.name}
            onChange={(e) => setSection({ ...section, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Imagen</label>
          <input
            type="file"
            onChange={uploadImage}
            accept="image/*"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          {uploading && <div className="text-blue-500 mt-2">Subiendo...</div>}
          {imageUploadUrl && (
            <div className="mt-2 flex items-center">
              <img src={imageUploadUrl} className="w-16 h-16 object-cover rounded-lg shadow" />
              <button
                onClick={addImageUrl}
                className="ml-4 bg-green-500 text-white px-3 py-1 rounded-lg text-sm transition duration-300"
              >
                Agregar
              </button>
            </div>
          )}
          {section.image && (
            <div className="mt-2">
              <img src={section.image} className="w-16 h-16 object-cover rounded-lg shadow" />
              <button
                onClick={removeImage}
                className="ml-4 bg-red-500 text-white px-3 py-1 rounded-lg text-sm transition duration-300"
              >
                Quitar
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition duration-300"
        >
          Guardar Sección
        </button>
        <button
          onClick={() => navigate(`/section/${id}`)}
          className="ml-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition duration-300"
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default EditSectionPage;