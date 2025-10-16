import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

# Conexión a Cosmos DB
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["tienda_db"]

# Clave secreta para JWT
SECRET_KEY = os.getenv("SECRET_KEY", "tu_clave_secreta_super_segura")