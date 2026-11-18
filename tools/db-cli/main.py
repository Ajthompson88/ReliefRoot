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
    tables = ["User", "Product", "Session", "Organization", "Metric", "Effect", "SessionEffect", "SessionMetric"]
    print("Database tables:")
    for table in tables:
        print(f" - {table}")

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



