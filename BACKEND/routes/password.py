from flask import request, jsonify, Blueprint
import bcrypt
from db import get_db_connection 
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import jwt
from dotenv import load_dotenv
import os
import datetime

load_dotenv()

SENDER_EMAIL = os.getenv('SENDER_EMAIL')
SENDER_PASSWORD = os.getenv('SENDER_PASSWORD')
SECRET_KEY = os.getenv('SECRET_KEY')
RESET_TOKEN_EXPIRY = 3600 
FRONTEND_URL = os.getenv('VITE_FRONTEND_URL')

authForgotPassword_bp = Blueprint('authForgotPassword_bp', __name__)
authResetPassword_bp = Blueprint('authResetPassword_bp', __name__)

def send_reset_email(to_email, reset_link):
    subject = "Password Reset Request"
    message = f"Click the link below to reset your password:\n{reset_link}"

    msg = MIMEMultipart()
    msg['From'] = SENDER_EMAIL
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(message, 'plain'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, to_email, msg.as_string())
        server.quit()
        print("Reset email sent successfully")
    except Exception as e:
        print(f"Failed to send email: {e}")

@authForgotPassword_bp.route('/auth/forgot-password', methods=['POST'])
def forgot_password():
    data = request.json
    email = data.get('email')
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        
        if not user:
            return jsonify({"error": "User does not exist."}), 404
        
        user_id = user[0]
        
        token = jwt.encode({
            'user_id': user_id,
            'email': email,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=RESET_TOKEN_EXPIRY)
        }, SECRET_KEY, algorithm="HS256")
        
        reset_link = f"{FRONTEND_URL}/reset-password/{token}"
        
        send_reset_email(email, reset_link)

        return jsonify({"message": "Password reset link sent to email."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@authResetPassword_bp.route('/auth/reset-password/<token>', methods=['POST'])
def reset_password(token):
    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Reset token has expired."}), 400
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid reset token."}), 400

    user_id = data.get('user_id')
    password = request.json.get('password')

    if not password:
        return jsonify({"error": "Password is required."}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        cursor.execute("UPDATE users SET password = %s WHERE id = %s", (hashed_password, user_id))
        conn.commit()
        return jsonify({"message": "Password reset successful."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
