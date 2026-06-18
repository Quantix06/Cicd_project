import pymysql
import pymysql.cursors
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_connection():
    """Create a new database connection to Aiven MySQL."""
    timeout = 10
    return pymysql.connect(
        charset="utf8mb4",
        connect_timeout=timeout,
        cursorclass=pymysql.cursors.DictCursor,
        db=os.getenv("MYSQL_DATABASE", "defaultdb"),
        host=os.getenv("MYSQL_HOST"),
        password=os.getenv("MYSQL_PASSWORD"),
        port=int(os.getenv("MYSQL_PORT", 3306)),
        user=os.getenv("MYSQL_USER"),
        read_timeout=timeout,
        write_timeout=timeout,
    )


# --- Pydantic models ---
class RegisterRequest(BaseModel):
    nom: str
    prenom: str
    email: str
    dateNaissance: str
    ville: str
    codePostal: str


# --- Endpoints ---

@app.get("/users")
async def get_users():
    """Get list of users with reduced information (public)."""
    conn = get_connection()
    try:
        cursor = conn.cursor()
        sql_select_query = "SELECT id, nom, prenom, ville FROM users"
        cursor.execute(sql_select_query)
        records = cursor.fetchall()
        return {"utilisateurs": records}
    finally:
        conn.close()


@app.get("/users/{user_id}")
async def get_user_details(user_id: int):
    """Get full details of a user."""
    conn = get_connection()
    try:
        cursor = conn.cursor()
        sql_select_query = "SELECT id, nom, prenom, email, date_naissance, ville, code_postal, created_at FROM users WHERE id = %s"
        cursor.execute(sql_select_query, (user_id,))
        record = cursor.fetchone()
        if not record:
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
        # Convert date objects to strings for JSON serialization
        if record.get("date_naissance"):
            record["date_naissance"] = str(record["date_naissance"])
        if record.get("created_at"):
            record["created_at"] = str(record["created_at"])
        return record
    finally:
        conn.close()


@app.post("/register")
async def register_user(user: RegisterRequest):
    """Register a new user in the database."""
    conn = get_connection()
    try:
        cursor = conn.cursor()
        sql_insert = """
            INSERT INTO users (nom, prenom, email, date_naissance, ville, code_postal)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(
            sql_insert,
            (
                user.nom,
                user.prenom,
                user.email,
                user.dateNaissance,
                user.ville,
                user.codePostal,
            ),
        )
        conn.commit()
        return {"message": "Utilisateur inscrit avec succès", "id": cursor.lastrowid}
    except pymysql.IntegrityError:
        raise HTTPException(
            status_code=400, detail="Cet email est déjà utilisé"
        )
    finally:
        conn.close()


@app.delete("/users/{user_id}")
async def delete_user(user_id: int):
    """Delete a user."""
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
        return {"message": "Utilisateur supprimé avec succès"}
    finally:
        conn.close()