from flask import Flask, jsonify
from flask_cors import CORS
from models import create_all_tables 
from middlewares.check_auth import verify_token
from dotenv import load_dotenv
import os
from routes.signup import authRegister_bp, authVerify_bp
from routes.login import authLogin_bp
from routes.password import authForgotPassword_bp, authResetPassword_bp
from routes.contacts import addContacts_bp, getContacts_bp, editContact_bp, deleteContact_bp
from routes.globalSearch import globalSearch_bp
from routes.spam import getSpam_bp, markSpam_bp
load_dotenv()
FRONTEND_URL = os.getenv('VITE_FRONTEND_URL')
print(f'FRONTEND_URL: {FRONTEND_URL}')
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": {FRONTEND_URL}}}, supports_credentials=True)

create_all_tables()

app.register_blueprint(authRegister_bp)
app.register_blueprint(authVerify_bp)
app.register_blueprint(authLogin_bp)
app.register_blueprint(authForgotPassword_bp)
app.register_blueprint(authResetPassword_bp)
app.register_blueprint(getContacts_bp)
app.register_blueprint(addContacts_bp)
app.register_blueprint(editContact_bp)
app.register_blueprint(deleteContact_bp)
app.register_blueprint(markSpam_bp)
app.register_blueprint(getSpam_bp)
app.register_blueprint(globalSearch_bp)


@app.route('/check-auth', methods=['GET'])
@verify_token
def check_auth(current_user):
    return jsonify({
        'isAuthenticated': True,
        'user': {
            'name': current_user['name'], 
            'email': current_user['email'],
            'phone': current_user['phone']
        }
    }), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
