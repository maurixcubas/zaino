import React from 'react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const sendToWhatsApp = () => {
    const message = encodeURIComponent(
      "Hola, quiero comprar:\n" +
      cart.map(item => `- ${item.name} x${item.quantity || 1}  [ID: ${item.id}]`).join("\n")
    );
    window.open(`https://wa.me/595994975629?text=${message}`);
  };

  return (
    <div className="cart-page p-8">
      <h1 className="text-2xl font-bold mb-6">Carrito de Compras</h1>
      {cart.length === 0 ? (
        <p className="text-gray-500 mt-4">Tu carrito está vacío</p>
      ) : (
        <div>
          <ul className="space-y-4">
            {cart.map(item => (
              <li key={item.id} className="flex items-center justify-between border-b pb-4">
                {/* Imagen del producto */}
                <div className="flex-shrink-0 w-16 h-16 mr-4">
                  <img
                    src={item.images?.[0] || 'https://placehold.co/60x60?text=Sin+Imagen'}
                    alt={item.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>

                {/* Información del producto */}
                <div className="flex-1">
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-gray-600">
                    Gs. {item.price} x {item.quantity || 1} = Gs. {item.price * (item.quantity || 1)}
                  </p>
                </div>

                {/* Botón de eliminar */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <p className="text-xl font-bold">Total: Gs. {total}</p>
            <button
              onClick={sendToWhatsApp}
              className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
            >
              Enviar pedido por WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;