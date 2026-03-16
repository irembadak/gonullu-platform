from flask import Flask, request, jsonify
from flask_cors import CORS
import math

app = Flask(__name__)
CORS(app)
EVENTS_DATABASE = [
    {"id": 1, "name": "Lojistik Destek Merkezi", "lat": 38.4237, "lng": 27.1428, "category": "Lojistik"},
    {"id": 2, "name": "Mobil Mutfak Yardımı", "lat": 38.4120, "lng": 27.1350, "category": "Gıda"},
    {"id": 3, "name": "Arama Kurtarma Eğitimi", "lat": 38.4500, "lng": 27.2000, "category": "Eğitim"},
    {"id": 4, "name": "Psikososyal Destek Grubu", "lat": 38.3800, "lng": 27.1000, "category": "Sağlık"}
]

def calculate_distance(lat1, lon1, lat2, lon2):
    """İki koordinat arasındaki yaklaşık mesafeyi hesaplar."""
    return math.sqrt((lat1 - lat2)**2 + (lon1 - lon2)**2)

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.json
        user_lat = data.get('lat')
        user_lng = data.get('lng')

        if user_lat is None or user_lng is None:
            return jsonify({"error": "Koordinatlar eksik"}), 400
        recommended = sorted(
            EVENTS_DATABASE, 
            key=lambda x: calculate_distance(user_lat, user_lng, x['lat'], x['lng'])
        )

        return jsonify(recommended[:3]) 

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5002, debug=True)