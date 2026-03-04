import requests
import json

url = "https://api.spacexdata.com/v4/launches/next"
response = requests.get(url)
data = response.json()

evenements = [
    {
        "name": data["name"],
        "date": data["date_utc"],
        "active": True,
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Emoji_u1f680.jpeg/1200px-Emoji_u1f680.jpeg"
    }
]

with open("evenements.json", "w") as f:
    json.dump(evenements, f)

print("evenements.json mis à jour avec le prochain lancement SpaceX !")