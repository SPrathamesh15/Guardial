from db import get_db_connection

def create_users_table():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(15),
        password VARCHAR(255) NOT NULL,
        otp INT,
        is_verified BOOLEAN DEFAULT 0
    )
    """)

    conn.commit()
    cursor.close()
    conn.close()
