import requests
from dotenv import load_dotenv
import os


def counterCups(numero_documento_paciente, codigo_cup):
    load_dotenv()
    url = os.getenv("ETL_WS_URL")

    if not url:
        print("No se encontró la URL del servicio ETL_WS_URL")
        return None

    payload = {
        "numero_documento_paciente": numero_documento_paciente,
        "codigo_cup": codigo_cup,
    }

    try:
        response = requests.post(url + "/contador-cups-terapias", json=payload, verify=False)
        data = None
        try:
            data = response.json()
        except Exception:
            data = None
        return {
            "status_code": response.status_code,
            "numero_autorizacion": data.get("numero_autorizacion") if data else None,
            "numero_cita": data.get("numero_cita") if data else None,
            "data": data
        }
    except requests.exceptions.RequestException as e:
        print(f"Error en la petición ETL: {e}")
        return {"status_code": None, "data": None}
