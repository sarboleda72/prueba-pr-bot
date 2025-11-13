import requests
from dotenv import load_dotenv
import os
from core.extract_token import getToken
from datetime import datetime

def extractFolio(documentType, identificationNumber, cups, reservationDate, months):
    token = getToken()

    if token:
        load_dotenv()
        url = os.getenv("WEBSERVICE_URL")

        headers = {
            "Authorization": f"Bearer {token}"
        }
        
        params = {
            "TipoIde": documentType,
            "Identificacion": identificationNumber,
            "Cups": cups,
            "FechaCita": reservationDate,
            "Meses": months
        }

        response = requests.get(url + "/Consultar/GetOrdenes", headers=headers, params=params, verify=False)
        if response.status_code == 200:
            data = response.json()
            orders = data.get("response")
            if orders:
                closest_order = min(orders, key=lambda x: abs(datetime.strptime(x["FechaAtencion"], '%Y-%m-%dT%H:%M:%S') - datetime.now()))
                return closest_order
            else:
                #print("No se encontraron órdenes.")
                return None
        else:
            print(f"Error al consultar las órdenes. Código de estado: {response}")
            return None
    else:
        print("No se pudo obtener el token.")
        return None