from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
import os
from datetime import datetime
app = Flask(__name__)
CORS(app)
# Initialize Firebase Admin
cred = credentials.Certificate({
    "type": "service_account",
    "project_id": "serviflix-8c900",
    "private_key_id": os.environ.get("FIREBASE_PRIVATE_KEY_ID"),
    "private_key": os.environ.get("FIREBASE_PRIVATE_KEY", "").replace('\\n', '\n'),
    "client_email": os.environ.get("FIREBASE_CLIENT_EMAIL"),
    "client_id": os.environ.get("FIREBASE_CLIENT_ID"),
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": os.environ.get("FIREBASE_CERT_URL")
})
firebase_admin.initialize_app(cred)
db = firestore.client()
@app.route('/api/professionals', methods=['GET'])
def get_professionals():
    try:
        # Get query parameters
        category = request.args.get('category')
        min_rating = float(request.args.get('minRating', 0))
        max_price = float(request.args.get('maxPrice', 10000))
        location = request.args.get('location', '')
        search_query = request.args.get('search', '')
        # Start with base query
        professionals_ref = db.collection('professionals')
        # Apply filters
        if category:
            professionals_ref = professionals_ref.where('category', '==', category)
        professionals_ref = professionals_ref.where('rating', '>=', min_rating)
        professionals_ref = professionals_ref.where('price', '<=', max_price)
        # Execute query
        docs = professionals_ref.stream()
        professionals = []
        for doc in docs:
            data = doc.to_dict()
            data['id'] = doc.id
            # Apply location filter (case-insensitive)
            if location and location.lower() not in data.get('location', '').lower():
                continue
            # Apply search filter
            if search_query:
                search_lower = search_query.lower()
                searchable_text = f"{data.get('name', '')} {data.get('serviceType', '')} {data.get('description', '')}".lower()
                if search_lower not in searchable_text:
                    continue
            professionals.append(data)
        # Sort by rating (descending)
        professionals.sort(key=lambda x: x.get('rating', 0), reverse=True)
        return jsonify({
            'success': True,
            'data': professionals,
            'count': len(professionals)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
@app.route('/api/professionals/<professional_id>', methods=['GET'])
def get_professional(professional_id):
    try:
        doc = db.collection('professionals').document(professional_id).get()
        if not doc.exists:
            return jsonify({
                'success': False,
                'error': 'Professional not found'
            }), 404
        data = doc.to_dict()
        data['id'] = doc.id
        return jsonify({
            'success': True,
            'data': data
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
@app.route('/api/professionals/top-rated', methods=['GET'])
def get_top_rated_professionals():
    try:
        limit = int(request.args.get('limit', 10))
        professionals_ref = db.collection('professionals') \
            .where('verified', '==', True) \
            .order_by('rating', direction=firestore.Query.DESCENDING) \
            .limit(limit)
        docs = professionals_ref.stream()
        professionals = []
        for doc in docs:
            data = doc.to_dict()
            data['id'] = doc.id
            professionals.append(data)
        return jsonify({
            'success': True,
            'data': professionals,
            'count': len(professionals)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
@app.route('/api/search', methods=['GET'])
def search():
    try:
        query = request.args.get('q', '')
        if not query:
            return jsonify({
                'success': False,
                'error': 'Search query is required'
            }), 400
        # Search in professionals
        professionals_ref = db.collection('professionals')
        docs = professionals_ref.stream()
        results = []
        query_lower = query.lower()
        for doc in docs:
            data = doc.to_dict()
            data['id'] = doc.id
            # Search in multiple fields
            searchable_text = f"{data.get('name', '')} {data.get('serviceType', '')} {data.get('description', '')} {' '.join(data.get('skills', []))}".lower()
            if query_lower in searchable_text:
                results.append(data)
        # Sort by rating
        results.sort(key=lambda x: x.get('rating', 0), reverse=True)
        return jsonify({
            'success': True,
            'data': results,
            'count': len(results)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
@app.route('/api/categories', methods=['GET'])
def get_categories():
    try:
        categories_ref = db.collection('categories')
        docs = categories_ref.stream()
        categories = []
        for doc in docs:
            data = doc.to_dict()
            data['id'] = doc.id
            # Count professionals in this category
            professionals_count = db.collection('professionals') \
                .where('category', '==', doc.id) \
                .count() \
                .get()
            data['count'] = professionals_count[0][0].value
            categories.append(data)
        return jsonify({
            'success': True,
            'data': categories
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    })
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)