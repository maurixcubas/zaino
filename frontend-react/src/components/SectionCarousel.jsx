import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SectionCarousel = ({ sections }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % sections.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + sections.length) % sections.length);
  };

  if (sections.length === 0) return null;

  const currentSection = sections[currentIndex];

  return (
    <div className="relative bg-white py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-6">Explora nuestras secciones</h2>
        <div className="flex items-center justify-between">
          <button
            onClick={prev}
            className="bg-gray-300 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-400 transition"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="flex-1 max-w-lg mx-auto">
            <Link to={`/section/${currentSection.id}`} className="block text-center">
              {/* ✅ Usa la imagen de la sección */}
              <img
                src={currentSection.image || 'https://placehold.co/300x200?text=' + currentSection.name}
                alt={currentSection.name}
                className="w-full h-48 object-cover rounded-lg shadow mb-4"
              />
              <h3 className="text-xl font-bold">{currentSection.name}</h3>
              <p className="text-gray-600 mt-2">Ver productos</p>
            </Link>
          </div>
          <button
            onClick={next}
            className="bg-gray-300 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-400 transition"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        <div className="flex justify-center mt-4">
          {sections.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`mx-1 w-3 h-3 rounded-full ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectionCarousel;