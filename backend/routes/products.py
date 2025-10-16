import uuid
from flask import Blueprint, jsonify, request
from models import products_collection, sections_collection

bp = Blueprint("products", __name__)

@bp.route("/api/sections", methods=["GET"])
def get_sections():
    sections = list(sections_collection.find({}))
    for section in sections:
        section["_id"] = str(section["_id"])  # Convertir ObjectId a string
    return jsonify(sections)

@bp.route("/api/sections", methods=["POST"])
def add_section():
    data = request.json
    # Asegúrate de que tenga los campos necesarios
    if not data.get("id") or not data.get("name"):
        return jsonify({"error": "ID y nombre son requeridos"}), 400
    
    # Si viene el campo image, guárdalo; si no, pon un valor por defecto
    data["image"] = data.get("image", f"https://placehold.co/300x200?text={data['name']}")

    sections_collection.insert_one(data)
    return jsonify({"message": "Sección agregada correctamente"})

@bp.route("/api/sections/<section_id>", methods=["PUT"])
def update_section(section_id):
    data = request.json
    # Actualizar los campos que vengan en data
    update_data = {}
    if "name" in data:
        update_data["name"] = data["name"]
    if "image" in data:
        update_data["image"] = data["image"]

    result = sections_collection.update_one({"id": section_id}, {"$set": update_data})
    if result.matched_count:
        return jsonify({"message": "Sección actualizada correctamente"})
    else:
        return jsonify({"error": "Sección no encontrada"}), 404

@bp.route("/api/sections/<section_id>", methods=["DELETE"])
def delete_section(section_id):
    sections_collection.delete_one({"id": section_id})
    return jsonify({"message": "Sección eliminada correctamente"})

@bp.route("/api/sections/<section_id>/products", methods=["GET"])
def get_products_by_section(section_id):
    products = list(products_collection.find({"section_id": section_id}, {"_id": 0}))
    return jsonify(products)

@bp.route("/api/products", methods=["GET"])
def get_products():
    products = list(products_collection.find({}, {"_id": 0}))
    return jsonify(products)

@bp.route("/api/products", methods=["POST"])
def add_product():
    data = request.json
    # Generar un ID único basado en el nombre del producto y un UUID
    product_name = data.get('name', '').lower()
    # Usar todas las palabras del nombre para generar el prefijo
    if product_name:
        # Obtener todas las palabras y juntar solo las letras (sin espacios ni símbolos)
        words = product_name.split()
        prefix = ''.join(''.join(filter(str.isalpha, word)) for word in words if word)
        prefix = prefix if prefix else 'prod'
    else:
        prefix = 'prod'
    
    unique_id = f"{prefix}-{uuid.uuid4().hex[:6]}"  # Ej: carteradepiel-a1b2c3
    
    data['id'] = unique_id  # Asignar el ID generado
    
    result = products_collection.insert_one(data)
    return jsonify({'message': 'Producto agregado', 'id': unique_id}), 201

@bp.route("/api/products/<product_id>", methods=["DELETE"])
def delete_product(product_id):
    products_collection.delete_one({"id": product_id})
    return jsonify({"message": "Producto eliminado correctamente"})

@bp.route("/api/products/<product_id>", methods=["PUT"])
def update_product(product_id):
    data = request.json
    # Actualizar el producto en la base de datos
    result = products_collection.update_one({"id": product_id}, {"$set": data})
    if result.matched_count:
        return jsonify({"message": "Producto actualizado correctamente"})
    else:
        return jsonify({"error": "Producto no encontrado"}), 404
    
@bp.route("/api/products/<product_id>", methods=["GET"])
def get_product(product_id):
    product = products_collection.find_one({"id": product_id}, {"_id": 0})
    if product:
        return jsonify(product)
    else:
        return jsonify({"error": "Producto no encontrado"}), 404

    