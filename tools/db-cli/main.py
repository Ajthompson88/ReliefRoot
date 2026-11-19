import os
from decimal import Decimal
from pathlib import Path

import psycopg
from dotenv import load_dotenv
from psycopg import sql

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
    print("1. List all database tables")
    print("2. View records from a table")
    print("3. Search records")
    print("4. View database statistics")
    print("5. Exit")
    print("6. About ReliefRoot CLI")


def display_about():
    print("ReliefRoot CLI is a Python tool for interacting with the ReliefRoot PostgreSQL database.")


def display_records(records, column_names):
    for record_number, record in enumerate(records, start=1):
        print(f"\nRecord {record_number}:")

        for column_name, value in zip(column_names, record):
            if isinstance(value, Decimal):
                value = f"{value:.2f}"

            print(f"  {column_name}: {value}")


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
                sql.Identifier(table_name)
            )

            cursor.execute(query)
            records = cursor.fetchall()
            column_names = [column.name for column in cursor.description]

            if records:
                display_records(records, column_names)
            else:
                print(f"No records found in '{table_name}'.")
        else:
            print(f"Table '{table_name}' does not exist.")


def search_records():
    print("Search database records")
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
            column_name = input("Enter column name: ")

            cursor.execute("""
                SELECT column_name, data_type
                FROM information_schema.columns
                WHERE table_schema = 'public'
                AND table_name = %s
                AND column_name = %s;
            """, (table_name, column_name))

            column_result = cursor.fetchone()

            if column_result:
                print(f"Column '{column_name}' found in table '{table_name}'!")
                search_value = input("Enter search value: ")


                query = sql.SQL(
                    "SELECT * FROM {} WHERE {}::text ILIKE %s LIMIT 10;"
                ).format(
                    sql.Identifier(table_name),
                    sql.Identifier(column_name)
                )

                cursor.execute(query, (f"%{search_value}%",))
                records = cursor.fetchall()

                column_names = [column.name for column in cursor.description]

                if records:
                    display_records(records, column_names)
                else:
                    print(f"No records found matching '{search_value}'.")

            else:
                print(f"Column '{column_name}' does not exist in table '{table_name}'.")

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
        search_records()

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


def main():

    display_name()

    running = True

    while running:
        display_menu()
        selected_option = input("Select an option (1-6): ")
        running = handle_choice(selected_option)


if __name__ == "__main__":
    main()
