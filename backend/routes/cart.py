from flask import Blueprint, jsonify, request

bp = Blueprint("cart", __name__)

# Simulación de carrito en memoria (puedes usar Redis o DB)
cart = []

@bp.route("/api/cart", methods=["GET"])
def get_cart():
    return jsonify(cart)

@bp.route("/api/cart", methods=["POST"])
def add_to_cart():
    data = request.json
    cart.append(data)
    return jsonify({"message": "Producto agregado al carrito", "cart": cart})