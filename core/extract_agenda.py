import os
import json
import requests
import pandas as pd
from tqdm import tqdm
from dotenv import load_dotenv
from datetime import datetime, timedelta
from core.extract_token import getToken

def getCompany():
    token = getToken()

    if token:
        load_dotenv()
        url = os.getenv("WEBSERVICE_URL")

        headers = {
            "Authorization": f"Bearer {token}"
        }

        response = requests.get(url + "/Maestros/GetEmpresa", headers=headers, verify=False)
        if response.status_code == 200:
            data = response.json()
            return data.get("response")  
        else:
            print(f"Error al consultar la empresa. Código de estado: {response.status_code}")
            return None
    else:
        print("No se pudo obtener el token.")
        return None

def getBranch(cod_empresa):
    token = getToken()

    if token:
        load_dotenv()
        url = os.getenv("WEBSERVICE_URL")

        headers = {
            "Authorization": f"Bearer {token}"
        }
        
        params = {
        "CodEmpresa": cod_empresa
         }

        response = requests.get(url + "/Maestros/GetSede", headers=headers, params=params, verify=False)
        if response.status_code == 200:
            data = response.json()
            return data.get("response")  
        else:
            print(f"Error al consultar la sede. Código de estado: {response.status_code}")
            return None
    else:
        print("No se pudo obtener el token.")
        return None

def getAppointment(cod_empresa, cod_sede):
    token = getToken()

    if token:
        load_dotenv()
        url = os.getenv("WEBSERVICE_URL")

        startDate = datetime.now().strftime("%Y-%m-%d")
        endDate = (datetime.now() + timedelta(days=8)).strftime("%Y-%m-%d")

        headers = {
            "Authorization": f"Bearer {token}"
        }

        params = {
            "CodEmpresa": cod_empresa,
            "CodSede": cod_sede,
            "FechIni": startDate,
            "FechFin": endDate
        }

        response = requests.get(url + "/Consultar/GetCitas", headers=headers, params=params, verify=False)
        if response.status_code == 200:
            data = response.json()
            return data.get("response")
        else:
            print(f"Error al consultar citas. Código de estado: {response.status_code}")
            return None
    else:
        print("No se pudo obtener el token.")
        return None

def listAgenda():
    companies = getCompany()
    if companies:
        data = []
        totalSteps = len(companies)
        progressBar = tqdm(total=totalSteps, desc="Consultando agendamientos", unit="empresa")
        
        for company in companies:
            codCompany = company["CodEmpresa"]
            branches = getBranch(codCompany)
            if branches:
                for branch in branches:
                    codBranch = branch["CodSede"]
                    appointments = getAppointment(codCompany, codBranch)
                    if appointments:
                        for appointment in appointments:
                            if appointment["NomEstado"] == "RESERVADA":
                                data.append({
                                    **appointment,
                                    "state":None
                                })
            progressBar.update(1)
        
        progressBar.close()
        df = pd.DataFrame(data)
        return df if not df.empty else pd.DataFrame()
    else:
        return pd.DataFrame()