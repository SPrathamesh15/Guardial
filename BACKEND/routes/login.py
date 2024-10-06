from flask import request, jsonify, Blueprint
import bcrypt
from db import get_db_connection
import jwt
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')

authLogin_bp = Blueprint('authLogin_bp', __name__)

@authLogin_bp.route('/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT id, password, is_verified, name, phone FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "User does not exist."}), 404

        user_id, stored_password, is_verified, name, phone = user

        if is_verified == 0:
            return jsonify({"error": "User is not verified."}), 400

        if bcrypt.checkpw(password.encode('utf-8'), stored_password.encode('utf-8')):
            token = jwt.encode({
                'user_id': user_id,
                'email': email,
                'name': name,
                'phone': phone
            }, SECRET_KEY, algorithm="HS256")

            user_info = {
                'id': user_id,
                'email': email,
                'name': name,
                'phone': phone
            }

            return jsonify({"message": "Login successful.", "token": token, "user": user_info}), 200
        else:
            return jsonify({"error": "Invalid password."}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
