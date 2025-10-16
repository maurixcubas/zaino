from flask import Blueprint, request, jsonify
from azure.storage.blob import BlobServiceClient
import os
import uuid

bp = Blueprint("images", __name__)

@bp.route("/api/upload-image", methods=["POST"])
def upload_image():
    try:
        # Obtener archivo del formulario
        if 'image' not in request.files:
            return jsonify({"error": "No se encontró archivo"}), 400

        file = request.files['image']
        if file.filename == '':
            return jsonify({"error": "Nombre de archivo vacío"}), 400

        # Validar tipo de archivo
        if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
            return jsonify({"error": "Formato de archivo no permitido"}), 400

        # Conectar a Azure Blob Storage
        account_name = os.getenv("AZURE_STORAGE_ACCOUNT_NAME")
        account_key = os.getenv("AZURE_STORAGE_ACCOUNT_KEY")
        container_name = os.getenv("AZURE_STORAGE_CONTAINER_NAME", "imagenes")

        blob_service_client = BlobServiceClient(
            account_url=f"https://{account_name}.blob.core.windows.net",
            credential=account_key
        )

        # Generar nombre único para la imagen
        blob_name = f"{uuid.uuid4()}-{file.filename}"
        blob_client = blob_service_client.get_blob_client(
            container=container_name,
            blob=blob_name
        )

        # Subir archivo
        blob_client.upload_blob(file.stream, blob_type="BlockBlob")

        # URL pública de la imagen
        image_url = f"https://{account_name}.blob.core.windows.net/{container_name}/{blob_name}"

        return jsonify({"url": image_url})

    except Exception as e:
        return jsonify({"error": str(e)}), 500