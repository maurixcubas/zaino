from config import db
import uuid

# Obtener todos los productos
products = db.products.find({})

for product in products:
    # Generar ID si no existe
    if not product.get("id"):
        new_id = f"prod-{uuid.uuid4().hex[:8]}"
        db.products.update_one(
            {"_id": product["_id"]},
            {"$set": {"id": new_id}}
        )
        print(f"Producto '{product.get('name', 'Sin nombre')}' actualizado con ID: {new_id}")

print("✅ IDs añadidos a todos los productos")