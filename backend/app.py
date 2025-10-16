from flask import Flask
from flask_cors import CORS
from routes import products, auth, cart, images  # Añade images

app = Flask(__name__)
CORS(app)

# Registra los blueprints
app.register_blueprint(products.bp)
app.register_blueprint(auth.bp)
app.register_blueprint(cart.bp)
app.register_blueprint(images.bp)  # Añade esta línea

@app.route("/")
def home():
    return "<h1>API de Tienda Flask</h1>"

if __name__ == "__main__":
    app.run(debug=True)