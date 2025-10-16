from flask import Blueprint, jsonify, request
import jwt
import datetime
from config import SECRET_KEY

bp = Blueprint("auth", __name__)

@bp.route("/api/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    # Validación simple (en producción usa una base de datos/hash)
    if username == "admin" and password == "password":
        token = jwt.encode({
            "user": username,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, SECRET_KEY, algorithm="HS256")

        return jsonify({"status": "success", "token": token})
    else:
        return jsonify({"status": "error", "message": "Credenciales incorrectas"}), 401

@bp.route("/api/verify-token", methods=["POST"])
def verify_token():
    data = request.json
    token = data.get("token")

    try:
        jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return jsonify({"valid": True})
    except jwt.ExpiredSignatureError:
        return jsonify({"valid": False, "message": "Token expirado"})
    except jwt.InvalidTokenError:
        return jsonify({"valid": False, "message": "Token inválido"})