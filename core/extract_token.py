import requests
from dotenv import load_dotenv
import os
import jwt
from datetime import datetime, timedelta

# Cache del token
_cached_token = None
_token_expiration = None

def getToken():
    global _cached_token, _token_expiration
    
    # Si hay un token en cache y aún es válido, retornarlo
    if _cached_token and _token_expiration:
        tiempo_restante = (_token_expiration - datetime.now()).total_seconds() / 60
        # Verificar si el token expira en más de 5 minutos
        if tiempo_restante > 1:
            #print(f"✅ Usando token en caché (válido por {tiempo_restante:.1f} minutos más)")
            return _cached_token
        else:
            print(f"⚠️ Token en caché expira pronto ({tiempo_restante:.1f} minutos), renovando...")
    
    # Si no hay cache o expiró, obtener uno nuevo
    print("🔄 Solicitando nuevo token...")
    load_dotenv()
    USER = os.getenv("WEBSERVICE_USER")
    PASSWORD = os.getenv("WEBSERVICE_PASSWORD")
    URL = os.getenv("WEBSERVICE_URL")

    params = {
        "Usuario": USER,
        "Clave": PASSWORD
    }

    try:
        response = requests.get(URL + "/Token/GetToken", params=params, verify=False, timeout=30)
    except requests.exceptions.Timeout:
        print(f"❌ Timeout al obtener el token desde {URL}")
        if _cached_token:
            print("⚠️ Usando token en caché como respaldo")
        return _cached_token
    except requests.exceptions.ConnectionError:
        print(f"❌ Error de conexión con {URL}")
        if _cached_token:
            print("⚠️ Usando token en caché como respaldo")
        return _cached_token
    except Exception as e:
        print(f"❌ Error inesperado obteniendo token: {e}")
        if _cached_token:
            print("⚠️ Usando token en caché como respaldo")
        return _cached_token

    if response.status_code == 200:
        data = response.json()
        token = data.get("response")
        
        if token:
            # Decodificar el token para obtener la fecha de expiración
            try:
                decoded = jwt.decode(token, options={"verify_signature": False})
                exp_timestamp = decoded.get("exp")
                if exp_timestamp:
                    _token_expiration = datetime.fromtimestamp(exp_timestamp)
                    _cached_token = token
                    tiempo_validez = (_token_expiration - datetime.now()).total_seconds() / 60
                    print(f"✅ Nuevo token obtenido. Válido por {tiempo_validez:.1f} minutos (expira: {_token_expiration.strftime('%Y-%m-%d %H:%M:%S')})")
                else:
                    # Si no tiene exp, asumir que dura 1 hora
                    _token_expiration = datetime.now() + timedelta(hours=1)
                    _cached_token = token
                    print(f"✅ Nuevo token obtenido (sin exp en JWT, asumiendo 1 hora de validez)")
            except Exception as e:
                print(f"⚠️ Error decodificando token JWT: {e}")
                # Si no se puede decodificar, asumir que dura 1 hora
                _token_expiration = datetime.now() + timedelta(hours=1)
                _cached_token = token
                print(f"✅ Nuevo token obtenido (asumiendo 1 hora de validez)")
        
        return token
    else:
        print(f"❌ Error al obtener el token. Código de estado: {response.status_code}")
        if _cached_token:
            print("⚠️ Usando token en caché como respaldo")
        return _cached_token