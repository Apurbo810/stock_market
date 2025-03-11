# backend/app.py (jsonModel)
from flask import Flask, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

# Load JSON data
with open('stock_market_data.json', 'r') as f:
    data = json.load(f)

@app.route('/data', methods=['GET'])
def get_json_data():
    """Serve data directly from the JSON file (jsonModel)."""
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)