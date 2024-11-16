import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv
import os

from flask import Flask
load_dotenv()
app = Flask(__name__)

@app.route("/api/python")
def hello_world():
    connection = psycopg2.connect(
            dbname=os.environ["POSTGRES_DATABASE"],
            user=os.environ["POSTGRES_USER"],
            password=os.environ["POSTGRES_PASSWORD"],
            host="ep-gentle-scene-a495f3zt-pooler.us-east-1.aws.neon.tech",
            port="5432"
        )

    # Create a cursor object
    cursor = connection.cursor()

    # Prepare and execute the SQL query to fetch all data
    query = sql.SQL("SELECT * FROM todos")
    cursor.execute(query)

    # Fetch all rows from the executed query
    rows = cursor.fetchall()
     
    return rows

