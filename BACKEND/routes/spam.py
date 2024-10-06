from flask import request, jsonify, Blueprint, g
from db import get_db_connection
from middlewares.auth_middleware import token_required

markSpam_bp = Blueprint('markSpam_bp', __name__)
getSpam_bp = Blueprint('getSpam_bp', __name__)

@markSpam_bp.route('/api/mark-spam', methods=['POST'])
@token_required
def mark_as_spam():
    data = request.json
    phone = data.get('phone')
    user_id = g.user_id 

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT id FROM contacts WHERE phone = %s", (phone,))
        contact = cursor.fetchone()

        if not contact:
            return jsonify({"error": "Contact not found!"}), 404

        contact_id = contact[0]  

        cursor.execute("""
            SELECT * FROM spam_marks WHERE user_id = %s AND contact_id = %s
        """, (user_id, contact_id))

        if cursor.fetchone():
            return jsonify({"message": "You have already marked this contact as spam!"}), 400

        cursor.execute("""
            UPDATE contacts
            SET is_spammer = TRUE, spam_likelihood = spam_likelihood + 1
            WHERE id = %s
        """, (contact_id,))

        cursor.execute("""
            INSERT INTO spam_marks (user_id, contact_id)
            VALUES (%s, %s)
        """, (user_id, contact_id))

        conn.commit()
        return jsonify({"message": "Contact marked as spam!"}), 200

    except Exception as e:
        conn.rollback()
        print(f'Error marking spam: {e}')
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
