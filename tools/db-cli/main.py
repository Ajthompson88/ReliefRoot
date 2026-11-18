from multiprocessing.dummy import connection
import os
import psycopg
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(env_path)

def connect_to_database():
  connection = psycopg.connect(
    host=os.getenv("POSTGRES_HOST"),
    port=os.getenv("POSTGRES_PORT"),
    dbname=os.getenv("POSTGRES_DB"),
    user=os.getenv("POSTGRES_USER"),
    password=os.getenv("POSTGRES_PASSWORD")
)
  return connection

def display_name():
  print("ReliefRoot Database CLI")


def display_menu():
  print ("1. List all database tables")
  print ("2. View records from a table")
  print ("3. Search records")
  print ("4. View database statistics")
  print ("5. Exit")
  print("6. About ReliefRoot CLI")

def display_about():
  print("ReliefRoot CLI is a Python tool for interacting with the ReliefRoot PostgreSQL database.")

def list_tables():
  with connect_to_database() as connection, connection.cursor() as cursor:
      cursor.execute("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name;
      """)
      tables = cursor.fetchall()


  print("Database tables:")
  for table in tables:
    print(f" - {table[0]}")

def handle_choice(selected_option):
  if selected_option == "1":
    print("Listing database tables...")
    list_tables()

  elif selected_option == "2":
    print("Viewing records from a table...")

  elif selected_option == "3":
    print("Searching records...")

  elif selected_option == "4":
    print("Viewing database statistics...")

  elif selected_option == "5":
    print("Exiting...")
    return False

  elif selected_option == "6":
    display_about()

  else:
    print("Invalid option. Please select a valid option (1-6).")

  return True

display_name()

running = True

while running:
  display_menu()
  selected_option = input("Select an option (1-6): ")
  running = handle_choice(selected_option)



