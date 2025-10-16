# scripts/update_product_ids.py
import sys
import os

# Añadir el directorio raíz al path para poder importar config
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from config import db
import uuid

def update_product_ids():
    products = db.products.find({})
    for product in products:
        if 'id' not in product or not product['id']:
            # Generar un nuevo ID si no existe
            product_name = product.get('name', '').lower()
            # Usar todas las palabras del nombre para generar el prefijo
            if product_name:
                # Obtener todas las palabras y juntar solo las letras (sin espacios ni símbolos)
                words = product_name.split()
                prefix = ''.join(''.join(filter(str.isalpha, word)) for word in words if word)
                prefix = prefix if prefix else 'prod'
            else:
                prefix = 'prod'
            new_id = f"{prefix}-{uuid.uuid4().hex[:6]}"
            
            # Actualizar en la base de datos
            db.products.update_one(
                {'_id': product['_id']},
                {'$set': {'id': new_id}}
            )
            print(f"Actualizado producto: {product.get('name')} -> ID: {new_id}")
        else:
            print(f"Producto ya tiene ID: {product['id']}")

if __name__ == '__main__':
    update_product_ids()