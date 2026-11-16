import base64
import hashlib
import hmac
import json
import secrets
import time

from app.database import token_secret


TOKEN_LIFETIME_SECONDS = 12 * 60 * 60


def hash_password(password):
    salt = secrets.token_bytes(16)
    hashed = hashlib.scrypt(password.encode(), salt=salt, n=2**14, r=8, p=1)
    return "scrypt${}${}".format(
        base64.urlsafe_b64encode(salt).decode(),
        base64.urlsafe_b64encode(hashed).decode(),
    )


def verify_password(password, stored_hash):
    try:
        algorithm, salt_text, hash_text = stored_hash.split("$")
        if algorithm != "scrypt":
            return False
        salt = base64.urlsafe_b64decode(salt_text)
        expected = base64.urlsafe_b64decode(hash_text)
        actual = hashlib.scrypt(password.encode(), salt=salt, n=2**14, r=8, p=1)
        return hmac.compare_digest(actual, expected)
    except (ValueError, TypeError):
        return False


def create_token(user_id, role, name, email):
    payload = {
        "sub": str(user_id),
        "role": role,
        "name": name,
        "email": email,
        "exp": int(time.time()) + TOKEN_LIFETIME_SECONDS,
    }
    encoded = base64.urlsafe_b64encode(
        json.dumps(payload, separators=(",", ":")).encode()
    ).decode().rstrip("=")
    signature = hmac.new(
        token_secret().encode(), encoded.encode(), hashlib.sha256
    ).hexdigest()
    return "{}.{}".format(encoded, signature)


def read_token(token):
    try:
        encoded, signature = token.split(".", 1)
        expected = hmac.new(
            token_secret().encode(), encoded.encode(), hashlib.sha256
        ).hexdigest()
        if not hmac.compare_digest(signature, expected):
            return None
        payload = json.loads(
            base64.urlsafe_b64decode(encoded + "=" * (-len(encoded) % 4))
        )
        if payload.get("exp", 0) <= time.time():
            return None
        return payload
    except (ValueError, TypeError, json.JSONDecodeError):
        return None
