import mysql.connector
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

conn = mysql.connector.connect(
    database=os.getenv("MYSQL_DATABASE"),
    user=os.getenv("MYSQL_USER_PY"),
    password=os.getenv("MYSQL_ROOT_PASSWORD"),
    port=3306,
    host=os.getenv("MYSQL_HOST")
)


@app.get("/users")
async def get_users():
    cursor = conn.cursor()
    sql_select_query = "SELECT * FROM users"
    cursor.execute(sql_select_query)
    records = cursor.fetchall()
    return {"utilisateurs": records}