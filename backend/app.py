import json
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Database configuration (using local PostgreSQL)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:root@localhost/test'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Define SQLAlchemy Model
class TradeData(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    date = db.Column(db.String(20), nullable=False)
    trade_code = db.Column(db.String(20), nullable=False)
    high = db.Column(db.Float, nullable=False)
    low = db.Column(db.Float, nullable=False)
    open = db.Column(db.Float, nullable=False)
    close = db.Column(db.Float, nullable=False)
    volume = db.Column(db.BigInteger, nullable=False)  # Store large numbers

# Create tables (run this once to create the tables)
with app.app_context():
    db.create_all()

# ----------------------- LOAD DATA FROM JSON -----------------------

def load_data_from_json():
    """Load data from stock_market_data.json into the database."""
    try:
        with open('stock_market_data.json') as file:
            data = json.load(file)

            for entry in data:
                try:
                    volume = int(entry['volume'].replace(',', ''))  # Convert volume to int
                except ValueError:
                    volume = 0  # Handle invalid values

                try:
                    high = float(entry['high'].replace(',', ''))
                    low = float(entry['low'].replace(',', ''))
                    open_price = float(entry['open'].replace(',', ''))
                    close = float(entry['close'].replace(',', ''))
                except ValueError:
                    high = low = open_price = close = 0.0  # Handle invalid values

                new_entry = TradeData(
                    date=entry['date'],
                    trade_code=entry['trade_code'],
                    high=high,
                    low=low,
                    open=open_price,
                    close=close,
                    volume=volume
                )

                db.session.add(new_entry)
            
            db.session.commit()
            return {"message": "Data loaded into database successfully!"}
    
    except Exception as e:
        return {"error": str(e)}

# API Endpoint to trigger data loading
@app.route('/load_data', methods=['GET'])
def load_data():
    response = load_data_from_json()
    return jsonify(response)

# ----------------------- CRUD OPERATIONS -----------------------

# CREATE: Add a new trade record
@app.route('/data', methods=['POST'])
def add_trade():
    data = request.json
    new_trade = TradeData(
        date=data['date'],
        trade_code=data['trade_code'],
        high=data['high'],
        low=data['low'],
        open=data['open'],
        close=data['close'],
        volume=data['volume']
    )
    db.session.add(new_trade)
    db.session.commit()
    return jsonify({'message': 'Trade record added successfully!'}), 201

# READ: Fetch all data from the database
@app.route('/data', methods=['GET'])
def get_data():
    data = TradeData.query.all()
    return jsonify([{
        'id': d.id,
        'date': d.date,
        'trade_code': d.trade_code,
        'high': d.high,
        'low': d.low,
        'open': d.open,
        'close': d.close,
        'volume': d.volume
    } for d in data])

# UPDATE: Modify an existing trade record
@app.route('/data/<int:id>', methods=['PUT'])
def update_trade(id):
    data = request.json
    trade = TradeData.query.get(id)
    
    if not trade:
        return jsonify({'message': 'Trade record not found!'}), 404
    
    trade.date = data.get('date', trade.date)
    trade.trade_code = data.get('trade_code', trade.trade_code)
    trade.high = data.get('high', trade.high)
    trade.low = data.get('low', trade.low)
    trade.open = data.get('open', trade.open)
    trade.close = data.get('close', trade.close)
    trade.volume = data.get('volume', trade.volume)

    db.session.commit()
    return jsonify({'message': 'Trade record updated successfully!'})

# DELETE: Remove a trade record
@app.route('/data/<int:id>', methods=['DELETE'])
def delete_trade(id):
    trade = TradeData.query.get(id)
    
    if not trade:
        return jsonify({'message': 'Trade record not found!'}), 404
    
    db.session.delete(trade)
    db.session.commit()
    return jsonify({'message': 'Trade record deleted successfully!'})

# Fetch unique trade codes
@app.route('/unique_trade_codes', methods=['GET'])
def get_unique_trade_codes():
    unique_trade_codes = db.session.query(TradeData.trade_code).distinct().all()
    return jsonify([trade_code[0] for trade_code in unique_trade_codes])





if __name__ == '__main__':
    app.run(debug=True)
