import base64
import hashlib
import hmac
import json
import os
import time
from datetime import date, datetime
from typing import Optional

import pymysql
import pymysql.cursors
from fastapi import Depends, FastAPI, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PUBLIC_USER_COLUMNS = "id, nom, prenom, ville"
ADMIN_USER_COLUMNS = "id, nom, prenom, date_naissance, email, ville, code_postal, created_at"
USER_FIELDS = ("nom", "prenom", "date_naissance", "email", "ville", "code_postal")
TOKEN_TTL_SECONDS = 60 * 60


# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------

class RegisterRequest(BaseModel):
    nom: str
    prenom: str
    email: str
    dateNaissance: str
    ville: str
    codePostal: str


class UserUpdate(BaseModel):
    nom: Optional[str] = None
    prenom: Optional[str] = None
    dateNaissance: Optional[str] = None
    email: Optional[str] = None
    ville: Optional[str] = None
    codePostal: Optional[str] = None


class AdminLogin(BaseModel):
    email: str
    password: str


# ---------------------------------------------------------------------------
# Database connections
# ---------------------------------------------------------------------------

def get_connection():
    """Return a DB connection — local (hors_prod) or Aiven (prod)."""
    if os.getenv("PYTHON_ENV") in (None, "hors_prod"):
        return pymysql.connect(
            db=os.getenv("MYSQL_DATABASE"),
            user=os.getenv("MYSQL_USER_PY", "root"),
            password=os.getenv("MYSQL_ROOT_PASSWORD"),
            port=3306,
            host=os.getenv("MYSQL_HOST"),
            charset="utf8mb4",
        )
    return get_connection_aiven()


def get_connection_aiven():
    """Create a database connection with SSL support for Aiven Cloud."""
    ssl_ca = os.getenv("MYSQL_SSL_CA")
    cert_content = os.getenv("AIVEN_CERTIFICAT")

    # On Vercel the cert is stored as an env var; write it to a temp file.
    if cert_content and not ssl_ca:
        import tempfile
        fd, temp_ca_path = tempfile.mkstemp()
        with os.fdopen(fd, "w") as f:
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


# ---------------------------------------------------------------------------
# Auth helpers
# ---------------------------------------------------------------------------

def get_required_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"La variable d'environnement {name} est manquante.",
        )
    return value


def hash_admin_password(password: str) -> str:
    salt = get_required_env("ADMIN_PASSWORD_SALT")
    return hashlib.sha256((password + salt).encode()).hexdigest()


def encode_token_part(value: bytes) -> str:
    return base64.urlsafe_b64encode(value).decode().rstrip("=")


def decode_token_part(value: str) -> bytes:
    padding = "=" * (-len(value) % 4)
    return base64.urlsafe_b64decode(value + padding)


def sign_token_payload(payload: str) -> str:
    secret = get_required_env("ADMIN_TOKEN_SECRET")
    signature = hmac.new(secret.encode(), payload.encode(), hashlib.sha256).digest()
    return encode_token_part(signature)


def create_admin_token(email: str) -> str:
    payload = {
        "email": email,
        "exp": int(time.time()) + TOKEN_TTL_SECONDS,
    }
    encoded_payload = encode_token_part(
        json.dumps(payload, separators=(",", ":"), sort_keys=True).encode()
    )
    signature = sign_token_payload(encoded_payload)
    return f"{encoded_payload}.{signature}"


def unauthorized_error():
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentification admin requise.",
    )


def verify_admin_token(token: str) -> str:
    try:
        encoded_payload, signature = token.split(".", 1)
        expected_signature = sign_token_payload(encoded_payload)

        if not hmac.compare_digest(signature, expected_signature):
            unauthorized_error()

        payload = json.loads(decode_token_part(encoded_payload))

        if int(payload.get("exp", 0)) < int(time.time()):
            unauthorized_error()

        email = payload.get("email")
        if not email:
            unauthorized_error()

        return email
    except (ValueError, json.JSONDecodeError, TypeError):
        unauthorized_error()


def get_current_admin(authorization: Optional[str] = Header(default=None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        unauthorized_error()
    return verify_admin_token(authorization.removeprefix("Bearer ").strip())


# ---------------------------------------------------------------------------
# Shared DB helpers
# ---------------------------------------------------------------------------

def get_user_or_404(cursor, user_id: int, columns: str = ADMIN_USER_COLUMNS):
    cursor.execute(f"SELECT {columns} FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur introuvable.",
        )
    return user


# ---------------------------------------------------------------------------
# Debug / health
# ---------------------------------------------------------------------------

@app.get("/")
async def root():
    """Debug route — shows env state (no secrets)."""
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


# ---------------------------------------------------------------------------
# Public endpoints
# ---------------------------------------------------------------------------

@app.get("/users")
async def get_users():
    """Get list of users with reduced information (public)."""
    conn = get_connection()
    try:
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        cursor.execute(f"SELECT {PUBLIC_USER_COLUMNS} FROM users ORDER BY id")
        records = cursor.fetchall()
        return {"utilisateurs": records}
    finally:
        conn.close()


@app.get("/users/{user_id}")
async def get_user_details(user_id: int):
    """Get full details of a single user."""
    conn = get_connection()
    try:
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        user = get_user_or_404(cursor, user_id)
        # Serialize date/datetime fields
        for field in ("date_naissance", "created_at"):
            if user.get(field):
                user[field] = str(user[field])
        return user
    finally:
        conn.close()


@app.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(user: RegisterRequest):
    """Register a new user in the database."""
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO users (nom, prenom, email, date_naissance, ville, code_postal)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (user.nom, user.prenom, user.email, user.dateNaissance, user.ville, user.codePostal),
        )
        conn.commit()
        return {"message": "Utilisateur inscrit avec succès", "id": cursor.lastrowid}
    except pymysql.err.IntegrityError:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Cet email est déjà utilisé.")
    finally:
        conn.close()


# ---------------------------------------------------------------------------
# Admin auth
# ---------------------------------------------------------------------------

@app.post("/admin/login")
async def login_admin(credentials: AdminLogin):
    conn = get_connection()
    try:
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        cursor.execute(
            "SELECT email, passwordHash FROM admins WHERE email = %s",
            (credentials.email,),
        )
        admin = cursor.fetchone()
        password_hash = hash_admin_password(credentials.password)

        if not admin or not hmac.compare_digest(admin["passwordHash"], password_hash):
            unauthorized_error()

        return {
            "token": create_admin_token(admin["email"]),
            "admin": {"email": admin["email"]},
        }
    finally:
        conn.close()


# ---------------------------------------------------------------------------
# Admin user management
# ---------------------------------------------------------------------------

@app.get("/admin/users")
async def get_admin_users(current_admin: str = Depends(get_current_admin)):
    conn = get_connection()
    try:
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        cursor.execute(f"SELECT {ADMIN_USER_COLUMNS} FROM users ORDER BY id")
        records = cursor.fetchall()
        return {"users": records}
    finally:
        conn.close()


@app.get("/admin/users/{user_id}")
async def get_admin_user(user_id: int, current_admin: str = Depends(get_current_admin)):
    conn = get_connection()
    try:
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        return get_user_or_404(cursor, user_id)
    finally:
        conn.close()


@app.patch("/admin/users/{user_id}")
async def update_admin_user(
    user_id: int,
    user: UserUpdate,
    current_admin: str = Depends(get_current_admin),
):
    conn = get_connection()
    # Map Pydantic field → DB column
    field_map = {
        "nom": "nom",
        "prenom": "prenom",
        "dateNaissance": "date_naissance",
        "email": "email",
        "ville": "ville",
        "codePostal": "code_postal",
    }
    data = {
        field_map[key]: value
        for key, value in (
            user.model_dump(exclude_unset=True) if hasattr(user, "model_dump") else user.dict(exclude_unset=True)
        ).items()
        if key in field_map and value is not None
    }

    try:
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        get_user_or_404(cursor, user_id)

        if data:
            set_clause = ", ".join(f"{col} = %s" for col in data)
            conn.cursor().execute(
                f"UPDATE users SET {set_clause} WHERE id = %s",
                tuple(data.values()) + (user_id,),
            )
            conn.commit()

        return get_user_or_404(cursor, user_id)
    except pymysql.err.IntegrityError:
        conn.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Un utilisateur avec cet email existe déjà.")
    finally:
        conn.close()


@app.delete("/admin/users/{user_id}")
async def delete_admin_user(user_id: int, current_admin: str = Depends(get_current_admin)):
    conn = get_connection()
    try:
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        get_user_or_404(cursor, user_id)
        cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
        conn.commit()
        return {"deletedId": user_id, "message": "Utilisateur supprimé."}
    finally:
        conn.close()