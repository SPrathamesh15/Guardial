from db import get_db_connection

def create_contacts_table():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        user_id INT NOT NULL, 
        is_spammer BOOLEAN DEFAULT 0,
        spam_likelihood INT DEFAULT 0,
        UNIQUE(phone, user_id)  
    )
    """)

    conn.commit()
    cursor.close()
    conn.close()
