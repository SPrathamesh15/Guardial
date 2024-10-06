from db import get_db_connection

def create_spam_marks_table():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS spam_marks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        contact_id INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (contact_id) REFERENCES contacts(id),
        UNIQUE(user_id, contact_id)
    )
    """)

    conn.commit()
    cursor.close()
    conn.close()
