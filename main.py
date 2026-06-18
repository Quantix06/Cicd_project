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
    #check if the env is prod or dev and set the connection parameters accordingly
    if os.getenv("PYTHON_ENV") == None or os.getenv("PYTHON_ENV") == "hors_prod":
        return pymysql.connect(
            db=os.getenv("MYSQL_DATABASE"),
            user=os.getenv("MYSQL_USER_PY", "root"),
            password=os.getenv("MYSQL_ROOT_PASSWORD"),
            port=3306,
            host=os.getenv("MYSQL_HOST"),
            charset="utf8mb4"
        )
    else:
        return get_connection_aiven()


def get_connection_aiven():
    """Create a new database connection with SSL support for Aiven Cloud."""
    ssl_ca = os.getenv("MYSQL_SSL_CA")
    cert_content = os.getenv("AIVEN_CERTIFICAT")
    
    # Si on est sur Vercel et que le chemin n'est pas défini, on crée un fichier temporaire
    if cert_content and not ssl_ca:
        import tempfile
        fd, temp_ca_path = tempfile.mkstemp()
        with os.fdopen(fd, 'w') as f:
            f.write(cert_content)
        ssl_ca = temp_ca_path

    timeout = 10
    connection_args = dict(
        charset="utf8mb4",
        connect_timeout=timeout,
        read_timeout=timeout,
        write_timeout=timeout,
        db=os.getenv("MYSQL_DATABASE", "defaultdb"),
        user=os.getenv("MYSQL_USER", "avnadmin"),
        password=os.getenv("MYSQL_PASSWORD"),
        port=int(os.getenv("MYSQL_PORT", 11033)),
        host=os.getenv("MYSQL_HOST"),
    )
    if ssl_ca:
        connection_args["ssl"] = {"ca": ssl_ca}
        
    return pymysql.connect(**connection_args)


# --- Pydantic models ---
class RegisterRequest(BaseModel):
    nom: str
    prenom: str
    email: str
    dateNaissance: str
    ville: str
    codePostal: str


# --- Endpoints ---

@app.get("/")
async def root():
    """Debug route to check environment variables."""
    return {
        "PYTHON_ENV": os.getenv("PYTHON_ENV"),
        "MYSQL_HOST": os.getenv("MYSQL_HOST"),
        "MYSQL_PORT": os.getenv("MYSQL_PORT"),
        "MYSQL_DATABASE": os.getenv("MYSQL_DATABASE"),
        "MYSQL_USER": os.getenv("MYSQL_USER"),
        "MYSQL_PASSWORD": "***" if os.getenv("MYSQL_PASSWORD") else None,
        "MYSQL_SSL_CA": os.getenv("MYSQL_SSL_CA"),
        "AIVEN_CERTIFICAT_SET": bool(os.getenv("AIVEN_CERTIFICAT")),
    }

@app.get("/users")
async def get_users():
    """Get list of users with reduced information (public)."""
    conn = get_connection()
    try:
        cursor = conn.cursor(pymysql.cursors.DictCursor)
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
        cursor = conn.cursor(pymysql.cursors.DictCursor)
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
    except pymysql.err.IntegrityError:
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