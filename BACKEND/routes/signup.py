from flask import request, jsonify, Blueprint
import bcrypt
import random
from db import get_db_connection
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import jwt
from dotenv import load_dotenv
import os

load_dotenv()

SENDER_EMAIL = os.getenv('SENDER_EMAIL')
SENDER_PASSWORD = os.getenv('SENDER_PASSWORD')
SECRET_KEY = os.getenv('SECRET_KEY')

authRegister_bp = Blueprint('authRegister', __name__)
authVerify_bp = Blueprint('authVerify', __name__)

def send_otp_email(to_email, otp):
    subject = "Your OTP Code"
    message = f"Your OTP code is {otp}. Please use this to complete your registration."

    msg = MIMEMultipart()
    msg['From'] = SENDER_EMAIL
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(message, 'plain'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls() 
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        text = msg.as_string()
        server.sendmail(SENDER_EMAIL, to_email, text)
        server.quit()
        print("OTP email sent successfully")
    except Exception as e:
        print(f"Failed to send OTP email: {e}")

@authRegister_bp.route('/auth/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    resend_otp = data.get('resend_otp', False)

    conn = get_db_connection()
    cursor = conn.cursor()

    if resend_otp:
        try:
            cursor.execute("SELECT email FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()
            
            if not user:
                return jsonify({"error": "User does not exist"}), 404

            otp = random.randint(100000, 999999)

            cursor.execute("UPDATE users SET otp = %s WHERE email = %s", (otp, email))
            conn.commit()

            send_otp_email(email, otp)

            return jsonify({"message": "OTP resent successfully."}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 400
        finally:
            cursor.close()
            conn.close()

    else:
        name = data.get('name')
        phone = data.get('phone')
        password = data.get('password')

        try:
            cursor.execute("SELECT email, is_verified FROM users WHERE email = %s", (email,))
            existing_user = cursor.fetchone()

            if existing_user:
                if existing_user[1] == 1:
                    return jsonify({"error": "User already registered and verified."}), 400
                else:
                    otp = random.randint(100000, 999999)
                    
                    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
                    
                    cursor.execute("""
                        UPDATE users SET name = %s, phone = %s, password = %s, otp = %s WHERE email = %s
                    """, (name, phone, hashed_password, otp, email))
                    conn.commit()

                    send_otp_email(email, otp)
                    return jsonify({"message": "User exists but not verified. Information updated and OTP resent."}), 200

            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            otp = random.randint(100000, 999999)

            cursor.execute("""
                INSERT INTO users (name, email, phone, password, otp, is_verified)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (name, email, phone, hashed_password, otp, 0))
            
            conn.commit()

            send_otp_email(email, otp)

            return jsonify({"message": "Registration successful, OTP sent to email."}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 400
        finally:
            cursor.close()
            conn.close()

@authVerify_bp.route('/auth/verify', methods=['POST'])
def verify_otp():
    data = request.json
    email = data.get('email')
    otp = data.get('otp')

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT otp, id, name, phone FROM users WHERE email = %s
        """, (email,))
        result = cursor.fetchone()

        if result and result[0] == int(otp):
            cursor.execute("""
                UPDATE users SET is_verified = 1 WHERE email = %s
            """, (email,))
            conn.commit()

            user_id = result[1]  
            token = jwt.encode({
                'user_id': user_id,
                'email': email,
                'name': result[2],
                'phone': result[3]
            }, SECRET_KEY, algorithm="HS256")

            return jsonify({"message": "OTP verified, account activated.", "token": token}), 200
        else:
            return jsonify({"error": "Invalid OTP"}), 400
    except Exception as e:
        print(f'error: %s' % e)
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        conn.close()
