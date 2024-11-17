import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv
import os
import random

from flask import Flask, jsonify
load_dotenv()
app = Flask(__name__)

@app.route("/api/python", methods=["GET", "POST"])
def hello_world():
    name = "Joey"
    prev_paper_topic = "math"
    liked = 1
    clicked = 1
    timespent = 50
    id = 0
    sum = 0
    
    connection = psycopg2.connect(
            dbname=os.environ["POSTGRES_DATABASE"],
            user=os.environ["POSTGRES_USER"],
            password=os.environ["POSTGRES_PASSWORD"],
            host="ep-gentle-scene-a495f3zt-pooler.us-east-1.aws.neon.tech",
            port="5432"
        )

    # Create a cursor object
    cursor = connection.cursor()

    query = sql.SQL(f"SELECT * FROM users where name='{name}';")
    cursor.execute(query)
    scores_arr = (cursor.fetchall())[0]

    scores = {
            "physics": scores_arr[1],
            "math": scores_arr[2],
            "cs": scores_arr[3],
            "quantbio": scores_arr[4],
            "quantfin": scores_arr[5],
            "ee": scores_arr[6],
            "stats": scores_arr[7],
            "econ": scores_arr[8]
        }
    
    for i in range(len(scores_arr)):
        if i != 0:
            sum += scores_arr[i]
      
    if liked == 1:
        scores[prev_paper_topic] += 1
    if clicked == 1:
        scores[prev_paper_topic] += 2
    #figure out log function for time spent

    q_string = f"""UPDATE users
                        SET {prev_paper_topic} = {scores[prev_paper_topic]} 
                        """

    query = sql.SQL(f"""UPDATE users
                        SET {prev_paper_topic} = {scores[prev_paper_topic]} 
                        """)
    cursor.execute(query)
    
    next_topic = random.choices(list(scores.keys()), list(scores.values()))[0]
    query = sql.SQL(f"SELECT * FROM papers where topics='{next_topic}';")
    cursor.execute(query)
    connection.commit()
    next_paper = (cursor.fetchall())

    # Prepare and execute the SQL query to fetch all data
    query = sql.SQL(f"SELECT title FROM papers where id={id};")
    cursor.execute(query)

    #Fetch all rows from the executed query
    rows = cursor.fetchall()
     
    return jsonify(next_paper)

