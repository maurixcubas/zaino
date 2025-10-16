from config import db

# Actualizar todas las secciones existentes para añadir el campo `image`
sections = db.sections.find({})

for section in sections:
    # Define una URL de imagen por defecto basada en el nombre
    image_url = f"https://placehold.co/300x200?text={section['name']}"
    
    # Actualizar el documento
    db.sections.update_one(
        {"_id": section["_id"]},
        {"$set": {"image": image_url}}
    )

print("✅ Secciones actualizadas con campo 'image'")