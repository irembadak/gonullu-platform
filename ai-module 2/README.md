#  AI Recommendation Module

This is a lightweight Python-based microservice that provides location-based volunteer activity recommendations using geospatial filtering.

##  Features
- **Proximity-Based Filtering:** Sorts activities based on the user's current GPS coordinates.
- **REST API:** Serves recommendations via a Flask-based endpoint.
- **CORS Support:** Integrated with Flask-CORS to communicate seamlessly with the React frontend.

## 🛠️ Tech Stack
- **Language:** Python 3.x
- **Framework:** Flask
- **Production Server:** Gunicorn
- **Mathematical Logic:** Euclidean Distance algorithm for proximity ranking.

##  Installation & Setup

1. **Navigate to the directory:**
   ```bash
   cd AI-MODULE-2

   2.Install dependencies:
   pip install -r requirements.txt

   3.Run the service:
   python app.py

   *The service will start on http://127.0.0.1:5002.

   API Endpoint
   POST /recommend
Returns the nearest 3 volunteer activities based on provided coordinates.
Request Body:
{
  "lat": 38.4237,
  "lng": 27.1428
}
Part of the Volunteer Coordination Platform ecosystem.