from .users import create_users_table
from .contacts import create_contacts_table
from .spams import create_spam_marks_table
def create_all_tables():
    create_users_table()
    create_contacts_table()
    create_spam_marks_table()