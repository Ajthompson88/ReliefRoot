import os
import psycopg
from psycopg import sql
from dotenv import load_dotenv
from pathlib import Path
from decimal import Decimal

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

def view_records():
  print("View table records")
  table_name = input("Enter table name: ")
  with connect_to_database() as connection, connection.cursor() as cursor:
        cursor.execute("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_name = %s;
          """, (table_name,))
        result = cursor.fetchone()
        if result:
          print(f"Table '{table_name}' found!")
          query = sql.SQL("SELECT * FROM {} LIMIT 10;").format(
          sql.Identifier(table_name))
          cursor.execute(query)
          records = cursor.fetchall()
          column_names = [column.name for column in cursor.description]

          if records:
            for record_number, record in enumerate(records, start=1):
              print(f"\nRecord {record_number}:")

              for column_name, value in zip(column_names, record):
                if isinstance(value, Decimal):
                  value = f"{value:.2f}"

                print(f"  {column_name}: {value}")
          else:
                print(f"No records found in '{table_name}'.")
        else:
          print(f"Table '{table_name}' does not exist.")

def handle_choice(selected_option):
  if selected_option == "1":
    print("Listing database tables...")
    list_tables()

  elif selected_option == "2":
    print("Viewing records from a table...")
    view_records()

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



