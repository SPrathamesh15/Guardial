from flask import request, jsonify, Blueprint, g
from db import get_db_connection
from middlewares.auth_middleware import token_required

addContacts_bp = Blueprint('addContacts_bp', __name__)
getContacts_bp = Blueprint('getContacts_bp', __name__)
editContact_bp = Blueprint('editContact_bp', __name__)
deleteContact_bp = Blueprint('deleteContact_bp', __name__)


@addContacts_bp.route('/api/contacts', methods=['POST'])
@token_required
def add_contact():
    data = request.json
    name = data.get('name')
    phone = data.get('phone')
    user_id = g.user_id  
    is_spammer = data.get('isSpammer', False)
    spam_likelihood = data.get('spamLikelihood', 0)

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT * FROM contacts 
            WHERE phone = %s AND user_id = %s
        """, (phone, user_id))
        
        existing_contact = cursor.fetchone()
        if existing_contact:
            return jsonify({"error": "Contact with this phone number already exists!"}), 400

        cursor.execute("""
            INSERT INTO contacts (name, phone, user_id, is_spammer, spam_likelihood)
            VALUES (%s, %s, %s, %s, %s)
        """, (name, phone, user_id, is_spammer, spam_likelihood))
        
        conn.commit()
        return jsonify({"message": "Contact added successfully!"}), 201
    except Exception as e:
        conn.rollback()
        print(f'Rollback error: {e}')
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        conn.close()

@getContacts_bp.route('/api/contacts', methods=['GET'])
@token_required
def get_contacts():
    user_id = g.user_id  
    page = request.args.get('page', 1, type=int) 
    limit = request.args.get('limit', 16, type=int)  
    offset = (page - 1) * limit  
        
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "SELECT id, name, phone, is_spammer, spam_likelihood FROM contacts WHERE user_id = %s LIMIT %s OFFSET %s",
            (user_id, limit, offset)
        )
        contacts = cursor.fetchall()

        cursor.execute("SELECT COUNT(*) FROM contacts WHERE user_id = %s", (user_id,))
        total_count = cursor.fetchone()[0]  

        contacts_list = []
        for contact in contacts:
            contacts_list.append({
                'id': contact[0],
                'name': contact[1],
                'phone': contact[2],
                'isSpammer': contact[3],
                'spamLikelihood': contact[4]
            })

        return jsonify({"contacts": contacts_list, "totalCount": total_count}), 200
    except Exception as e:
        print(f'getcontact error: {e}')
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        conn.close()

@editContact_bp.route('/api/contacts/<int:contact_id>', methods=['PUT'])
@token_required
def edit_contact(contact_id):
    data = request.json
    name = data.get('name')
    phone = data.get('phone')

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT name, phone FROM contacts WHERE id = %s AND user_id = %s", (contact_id, g.user_id))
        existing_contact = cursor.fetchone()

        if existing_contact is None:
            return jsonify({"error": "Contact not found or not authorized"}), 404

        if existing_contact[0] == name and existing_contact[1] == phone:
            return jsonify({"error": "No changes were made to the contact"}), 400

        cursor.execute("SELECT id FROM contacts WHERE phone = %s AND user_id = %s AND id != %s", (phone, g.user_id, contact_id))
        if cursor.fetchone() is not None:
            return jsonify({"error": "This phone number already exists in your contacts"}), 400

        cursor.execute("""
            UPDATE contacts 
            SET name = %s, phone = %s
            WHERE id = %s AND user_id = %s
        """, (name, phone, contact_id, g.user_id))

        if cursor.rowcount == 0:
            return jsonify({"error": "Contact not found or not authorized"}), 404

        conn.commit()
        return jsonify({"message": "Contact updated successfully!"}), 200
    except Exception as e:
        conn.rollback()
        print(f'Rollback error: {e}')
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        conn.close()

@deleteContact_bp.route('/api/contacts/<int:contact_id>', methods=['DELETE'])
@token_required
def delete_contact(contact_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            DELETE FROM contacts WHERE id = %s AND user_id = %s
        """, (contact_id, g.user_id))

        if cursor.rowcount == 0:
            return jsonify({"error": "Contact not found or not authorized"}), 404

        conn.commit()
        return jsonify({"message": "Contact deleted successfully!"}), 200
    except Exception as e:
        conn.rollback()
        print(f'Rollback error: {e}')
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        conn.close()
