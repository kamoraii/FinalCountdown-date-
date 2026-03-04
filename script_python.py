import requests
import json

# Exemple d'événements
evenements = [
    {
        "name": "SpaceX Falcon 9",
        "date": "2026-03-15T14:00:00Z",
        "active": True,
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Emoji_u1f680.jpeg/1200px-Emoji_u1f680.jpeg"
    },
    {
        "name": "Lancement satellite Starlink",
        "date": "2026-04-01T10:00:00Z",
        "active": True,
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Starlink-logo.jpeg/800px-Starlink-logo.jpeg"
    }
]

with open("evenements.json", "w") as f:
    json.dump(evenements, f)

print("evenements.json mis à jour !")
