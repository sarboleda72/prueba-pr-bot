import requests
from dotenv import load_dotenv
import os
from core.extract_token import getToken

def statusAgenda(companyCode, branchCode, documentType, identificationNumber, appointmentNumber):
    token = getToken()

    if token:
        load_dotenv()
        url = os.getenv("WEBSERVICE_URL")

        headers = {
            "Authorization": f"Bearer {token}"
        }
        
        params = {
            "CodEmpresa": companyCode,
            "CodSede": branchCode,
            "TipoIde": documentType,
            "Identificacion": identificationNumber,
            "NCita": appointmentNumber
        }

        response = requests.get(url + "/Consultar/GetCitasEstado", headers=headers, params=params, verify=False)
        if response.status_code == 200:
            data = response.json()
            return data.get("response")  
        else:
            print(f"Error al consultar el estado de la cita. Código de estado: {response.status_code}")
            return None
    else:
        print("No se pudo obtener el token.")
        return None