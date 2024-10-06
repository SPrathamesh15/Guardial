from db import get_db_connection
from flask import request, jsonify, Blueprint, g
from middlewares.auth_middleware import token_required

globalSearch_bp = Blueprint('globalSearch_bp', __name__)

@globalSearch_bp.route('/api/search', methods=['GET'])
@token_required
def search_contacts():
    query = request.args.get('query')
    current_user_phone = g.phone
    conn = get_db_connection()
    cursor = conn.cursor()

    search_term = f"%{query}%"

    cursor.execute("""
    SELECT 
        c.name, c.phone, c.is_spammer, u.email, u.is_verified,
        EXISTS (
            SELECT 1 FROM contacts cc
            WHERE cc.phone = c.phone AND cc.user_id = (SELECT id FROM users WHERE phone = %s)
        ) AS is_in_contact_list,
        (SELECT COUNT(*) FROM users) AS total_users,  -- Total registered users
        (SELECT COUNT(DISTINCT user_id) FROM contacts WHERE phone = c.phone AND is_spammer = 1) AS users_marked_spam -- Count distinct users who marked as spam
    FROM contacts c
    LEFT JOIN users u ON c.phone = u.phone
    WHERE c.name LIKE %s OR c.phone LIKE %s
    ORDER BY 
        CASE
            WHEN c.name LIKE %s THEN 1  -- Matches name starting with the query
            WHEN c.name LIKE %s THEN 2  -- Matches name containing the query
            ELSE 3
        END
    """, (current_user_phone, search_term, search_term, f"{query}%", search_term))
    
    contacts = cursor.fetchall()
    cursor.close()
    conn.close()

    results = []
    for contact in contacts:
        if len(contact) < 8:
            print(f"Error: Expected at least 8 columns but got {len(contact)} for contact: {contact}")
            continue
        print(f'contact: {contact}')
        name, phone, is_spammer, email, is_verified, is_in_contact_list, total_users, users_marked_spam = contact
        

        spam_likelihood = (users_marked_spam / total_users * 100) if total_users > 0 else 0
        
        results.append({
            'name': name,
            'phone': phone,
            'spamLikelihood': round(spam_likelihood, 2), 
            'isSpammer': is_spammer,
            'spamLikelyhood': users_marked_spam,
            'email': email if is_in_contact_list else None, 
            'isVerified': is_verified if email else False  
        })

    return jsonify(results)
