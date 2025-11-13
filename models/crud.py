from sqlmodel import Session, select
from models.schemas import Patient, Appointment, Event
from core.extract_agenda import listAgenda
from core.status_agenda import statusAgenda
from core.extract_folio import extractFolio
from core.counter_cups import counterCups
from tqdm import tqdm
from sqlalchemy import update
from datetime import datetime, timedelta
import os
import json
import pandas as pd
import numpy as np


def bulkInsertAgenda(session: Session):
    """
    Inserta múltiples registros de pacientes y agendamientos en la base de datos.
    Realiza verificaciones de existencia en bulk.
    Actualiza el estado expirado de los agendamientos cuya fecha ya pasó.

    :param session: Sesión activa de la base de datos.
    """
    agendaDF = listAgenda()

    existingPatientsSet = set(
        session.query(Patient.documentType, Patient.identificationNumber).all()
    )
    existingAppointmentsSet = {
        (appt.appointmentNumber, appt.branchCode): (appt.statusCode, appt.statusName)
        for appt in session.query(Appointment).all()
    }

    patientsInsert = []
    appointmentsInsert = []
    appointmentsUpdate = []

    newPatientsSet = set()

    totalSteps = len(agendaDF)
    progressBar = tqdm(total=totalSteps, desc="Procesando registros", unit="registro")

    for _, row in agendaDF.iterrows():
        patient_key = (row["TipoIde"], row["Identificacion"])
        
        # Validar datos críticos antes de procesar
        if not row["Identificacion"] or str(row["Identificacion"]).strip() == "":
            print(f"Saltando registro con identificación vacía: {row}")
            progressBar.update(1)
            continue
            
        # Validar y limpiar edad
        try:
            edad = int(row["Edad"]) if pd.notna(row["Edad"]) and not pd.isna(row["Edad"]) else 0
        except (ValueError, TypeError):
            edad = 0
            
        if patient_key not in existingPatientsSet and patient_key not in newPatientsSet:
            patient = Patient(
                documentType=row["TipoIde"],
                identificationNumber=str(row["Identificacion"]).strip(),
                firstName=row["Nombre1"],
                middleName=row.get("Nombre2", None),
                lastName=row["Apellido1"],
                secondLastName=row.get("Apellido2", None),
                birthDate=row["FechNacimiento"],
                age=edad,
                gender=row["Sexo"],
                address=row["Direccion"],
                phone=row["Telefono"],
            )
            patientsInsert.append(patient)
            newPatientsSet.add(patient_key)

        appointment_key = (row["NCita"], row["CodSede"])
        if appointment_key not in existingAppointmentsSet:
            reservationDate = datetime.strptime(row["FechaReserva"], "%Y-%m-%d")
            appointmentDate = datetime.strptime(row["FechCita"], "%Y-%m-%dT%H:%M:%S")
            differencesDays = (appointmentDate - reservationDate).days

            # Si el estado previo es "capita", mantenerlo
            if row["state"] == "capita":
                state = "capita"
            else:
                # Determinar el estado según la diferencia de días
                if differencesDays == 0:
                    state = "gestionado previamente"
                else:
                    state = "inicial"
            
            # Si no se encuentra el estado, asignar "inicial"
            if not state:
                state = "inicial"

            appointment = Appointment(
                companyCode=row["CodEmpresa"],
                companyName=row["NomEmpresa"],
                companyNit=row.get("CodAsegurador", ""),
                branchCode=row["CodSede"],
                branchName=row["NomSede"],
                appointmentNumber=row["NCita"],
                reservationDate=row["FechaReserva"],
                desiredDate=row["FechDeseada"],
                appointmentDate=row["FechCita"],
                appointmentTime=row["HoraCita"],
                documentType=row["TipoIde"],
                identificationNumber=row["Identificacion"],
                contractCode=row["CodContrato"],
                statusCode=row["CodEstado"],
                statusName=row["NomEstado"],
                cupsCode=row["CodCups"],
                cupsName=row["NomCups"],
                state=state,
            )
            appointmentsInsert.append(appointment)
        else:
            existing_status_code, existing_status_name = existingAppointmentsSet[
                appointment_key
            ]
            if (
                existing_status_code != row["CodEstado"]
                or existing_status_name != row["NomEstado"]
            ):
                appointmentsUpdate.append(
                    {
                        "appointmentNumber": row["NCita"],
                        "branchCode": row["CodSede"],
                        "statusCode": row["CodEstado"],
                        "statusName": row["NomEstado"],
                        "companyNit": row.get("CodAsegurador", "")
                    }
                )

        progressBar.update(1)

    progressBar.close()
    print(
        f"Registros a insertar: {len(patientsInsert)} pacientes, {len(appointmentsInsert)} agendamientos, {len(appointmentsUpdate)} actualizaciones"
    )

    # Revisar en la lista blanca si el cups existe para la sede
    # Traer todos los eventos de la base de datos
    eventos = session.query(Event).all()
    event_set = {(evento.branchCode, evento.cups) for evento in eventos}

    print(f"Eventos en la base de datos: {len(event_set)}")

    # Filtrar appointmentsInsert
    for appointment in appointmentsInsert:
        key = (appointment.branchCode, appointment.cupsCode)
        if appointment.companyNit in ["830053105-3", "900156264-2"]:
            if key in event_set:
                appointment.state = "inicial"
            else:
                appointment.state = "capita"

    # Filtrar appointmentsUpdate 
    for update_data in appointmentsUpdate:
        key = (update_data["branchCode"], update_data["cupsCode"])
        if update_data["companyNit"] in ["830053105-3", "900156264-2"]:
            if key in event_set:
                update_data["state"] = "inicial"
            else:
                update_data["state"] = "capita"

    if patientsInsert:
        session.bulk_save_objects(patientsInsert, return_defaults=False)
    if appointmentsInsert:
        session.bulk_save_objects(appointmentsInsert, return_defaults=False)

    if appointmentsUpdate:
        updateProgressBar = tqdm(
            total=len(appointmentsUpdate),
            desc="Actualizando registros",
            unit="registro",
        )
        for update_data in appointmentsUpdate:
            stmt = (
                update(Appointment)
                .where(
                    Appointment.appointmentNumber == update_data["appointmentNumber"]
                )
                .where(Appointment.branchCode == update_data["branchCode"])
                .values(
                    statusCode=update_data["statusCode"],
                    statusName=update_data["statusName"],
                    state=update_data["state"],
                )
            )
            session.execute(stmt)
            updateProgressBar.update(1)
        updateProgressBar.close()

    # Se actualizan los agendamientos con código cups 890201 y 890301 cuya fecha es mayor a 2025-01-01
    stmt = (
        update(Appointment)
        .where(Appointment.reservationDate > "2025-01-01")
        .where(Appointment.state == "inicial")
        .where(Appointment.cupsCode.in_(["890201", "890301"]))
        .values(state="capita")
    )
    session.execute(stmt)

    # Se actualizan los agendamientos cuya fecha ya pasó
    today = datetime.now()
    limitDate = today - timedelta(days=2)
    stmt = (
        update(Appointment)
        .where(Appointment.appointmentDate < limitDate)
        .where(Appointment.state == "inicial")
        .values(state="expirado")
    )
    session.execute(stmt)

    session.commit()
    updateAppointmentsNoSupport(session)
    updateAppointmentsWithAuthorization(session)
    # updateCapitatedAppointments(session)
    # cleanAppointmentsState(session)


def updateAppointmentsStatus(session: Session):
    """
    Actualiza el estado de los agendamientos según el estado devuelto por el servicio externo.
    """
    limit_date = datetime.now() - timedelta(days=1)

    stmt = (
        select(Appointment)
        .where(
            Appointment.cupsCode.in_(["890201", "890301"]),
            Appointment.state == "pendiente",
            Appointment.reservationDate > "2025-01-01",
            Appointment.appointmentDate < limit_date,
        )
        .order_by(Appointment.appointmentDate.desc())
    )

    appointments = session.exec(stmt).all()

    progressBar = tqdm(
        total=len(appointments),
        desc="Actualizando estados de agendamientos medicina general",
        unit="registro",
    )

    for appointment in appointments:

        status = statusAgenda(
            companyCode=appointment.companyCode,
            branchCode=appointment.branchCode,
            documentType=appointment.documentType,
            identificationNumber=appointment.identificationNumber,
            appointmentNumber=appointment.appointmentNumber,
        )

        if status:
            state = status[0].get("NomEstado")

            if state in ["ATENDIDA", "FACTURADA"]:
                newState = "medicina general"
            elif state in ["INCUMPLIDA", "CANCELADA", "CONFIRMADA"]:
                newState = "cancelada-incumplida"
            else:
                progressBar.update(1)
                continue

            stmt = (
                update(Appointment)
                .where(
                    Appointment.identificationNumber == appointment.identificationNumber
                )
                .where(Appointment.appointmentNumber == appointment.appointmentNumber)
                .values(state=newState, statusName=state)
            )
            session.execute(stmt)
        progressBar.update(1)
        session.commit()

    progressBar.close()


def updateAppointmentsFolio(session: Session):
    """
    Actualiza los campos ingreso y folio de los agendamientos según la respuesta de extractFolio.
    """
    init_date = datetime.now() - timedelta(days=3)
    end_date = datetime.now() + timedelta(days=7)

    stmt = (
        select(Appointment)
        .where(
            Appointment.folio.is_(None),
            Appointment.entry.is_(None),
            Appointment.reservationDate > "2025-01-01",
            Appointment.appointmentDate > init_date,
            Appointment.appointmentDate < end_date,
            Appointment.companyNit == "830053105-3"
        )
        .order_by(Appointment.appointmentDate.desc())
    )

    appointments = session.exec(stmt).all()

    progressBar = tqdm(
        total=len(appointments),
        desc="Actualizando folios de agendamientos",
        unit="registro",
    )

    for appointment in appointments:
        cups_code = appointment.cupsCode
        folio_data = extractFolio(
            documentType=appointment.documentType,
            identificationNumber=appointment.identificationNumber,
            cups=appointment.cupsCode,
            reservationDate=appointment.reservationDate.strftime("%Y-%m-%d"),
            months=12,
        )

        if not folio_data and cups_code.startswith("890"):
            alternate_cups_code = (
                cups_code[:3] + ("3" if cups_code[3] == "2" else "2") + cups_code[4:]
            )
            folio_data = extractFolio(
                documentType=appointment.documentType,
                identificationNumber=appointment.identificationNumber,
                cups=alternate_cups_code,
                reservationDate=appointment.reservationDate.strftime("%Y-%m-%d"),
                months=6,
            )

            if folio_data:
                folio = folio_data.get("Folio")
                entry = folio_data.get("Ingreso")
                attentionDate = folio_data.get("FechaAtencion")
                typeOrder = folio_data.get("Tipo")
                final_cups_code = alternate_cups_code

                if folio and entry:
                    stmt = (
                        update(Appointment)
                        .where(
                            Appointment.identificationNumber
                            == appointment.identificationNumber
                        )
                        .where(
                            Appointment.appointmentNumber
                            == appointment.appointmentNumber
                        )
                        .values(
                            folio=folio,
                            entry=entry,
                            attentionDate=attentionDate,
                            cupsCode=final_cups_code,
                            cupsHistory=cups_code,
                            typeOrder=typeOrder,
                        )
                    )
                    session.execute(stmt)
        elif folio_data:
            folio = folio_data.get("Folio")
            entry = folio_data.get("Ingreso")
            attentionDate = folio_data.get("FechaAtencion")
            typeOrder = folio_data.get("Tipo")

            if folio and entry:
                stmt = (
                    update(Appointment)
                    .where(
                        Appointment.identificationNumber
                        == appointment.identificationNumber
                    )
                    .where(
                        Appointment.appointmentNumber == appointment.appointmentNumber
                    )
                    .values(
                        folio=folio,
                        entry=entry,
                        attentionDate=attentionDate,
                        typeOrder=typeOrder,
                    )
                )
                session.execute(stmt)

        progressBar.update(1)
        session.commit()

    progressBar.close()


def updateAppointmentsStatusGeneral(session: Session):
    """
    Actualiza el estado de los agendamientos según el estado devuelto por el servicio externo.
    """
    init_date = datetime.now() - timedelta(days=1)
    end_date = datetime.now() + timedelta(days=7)

    stmt = (
        select(Appointment)
        .where(
            Appointment.state == "inicial",
            Appointment.reservationDate > "2025-01-01",
            Appointment.appointmentDate > init_date,
            Appointment.appointmentDate < end_date,
            Appointment.companyNit == "830053105-3"
        )
        .order_by(Appointment.appointmentDate.asc())
    )

    appointments = session.exec(stmt).all()

    progressBar = tqdm(
        total=len(appointments),
        desc="Actualizando estados de agendamientos general",
        unit="registro",
    )

    for appointment in appointments:

        status = statusAgenda(
            companyCode=appointment.companyCode,
            branchCode=appointment.branchCode,
            documentType=appointment.documentType,
            identificationNumber=appointment.identificationNumber,
            appointmentNumber=appointment.appointmentNumber,
        )

        if status:
            state = status[0].get("NomEstado")

            if state in ["INCUMPLIDA", "CANCELADA"]:
                newState = "cancelada-incumplida"
            else:
                progressBar.update(1)
                continue

            stmt = (
                update(Appointment)
                .where(
                    Appointment.identificationNumber == appointment.identificationNumber
                )
                .where(Appointment.appointmentNumber == appointment.appointmentNumber)
                .values(state=newState, statusName=state)
            )
            session.execute(stmt)
        progressBar.update(1)
        session.commit()

    progressBar.close()

"""
Bloque de codigo NO utilizado, pero mantenido para referencia futura.
"""
def updateCapitatedAppointments(session: Session, json_path: str = None):
    """
    Actualiza los registros de la base de datos según las condiciones del archivo JSON.

    :param session: Sesión activa de la base de datos.
    :param json_path: Ruta al archivo JSON que contiene los códigos de sede y cups.
    """
    if not json_path:
        json_path = os.path.join(os.path.dirname(__file__), "../data/departament.json")

    # Leer el archivo JSON
    with open(json_path, "r", encoding="utf-8") as file:
        capitated_data = json.load(file)

    # Iterar sobre los datos del JSON
    for item in capitated_data:
        codigo_sede = item["codigo_sede"]
        codigo_cups = item["codigo_cups"]

        # Actualizar los registros
        stmt = (
            update(Appointment)
            .where(Appointment.branchCode == str(codigo_sede))
            .where(Appointment.cupsCode == codigo_cups)
            .where(
                Appointment.state.notin_(
                    ["autorización gestionado", "capita", "gestionado OCGN", "gestionado previamente"]
                )
            )
            .values(state="capita")
        )

        session.execute(stmt)
        session.commit()


def updateAppointmentsNoSupport(session: Session):
    """
    Actualiza el estado de los agendamientos a 'no se encontro soporte'
    para aquellos con estado 'sin historico' y cuya fecha de cita sea 1 día o menos en el futuro.
    """

    limit_date = datetime.now() + timedelta(days=1)

    stmt = (
        update(Appointment)
        .where(Appointment.state == "sin historico")
        .where(Appointment.appointmentDate < limit_date)
        .where(Appointment.companyNit == "830053105-3")
        .values(state="no se encontro soporte")
    )

    session.execute(stmt)
    session.commit()

"""
Bloque de codigo NO utilizado, pero mantenido para referencia futura.
"""
def cleanAppointmentsState(session: Session):
    """
    Limpia los agendamientos en estado 'sin historico' aplicando las reglas de filtrado de listAgenda.
    """
    # Cargar los datos de los archivos JSON
    with open("./data/departament.json", "r", encoding="utf-8") as dep_file:
        departament_data = json.load(dep_file)

    with open("./data/whiteList.json", "r", encoding="utf-8") as white_file:
        white_list_data = json.load(white_file)

    # Crear un conjunto de tuplas (departamento, cups) para búsquedas rápidas
    white_list_set = {(item["departamento"], item["cups"]) for item in white_list_data}

    # Consultar los agendamientos en estado 'sin historico'
    stmt = select(Appointment).where(Appointment.state == "sin historico")
    appointments = session.exec(stmt).all()

    progressBar = tqdm(total=len(appointments), desc="Limpiando agendamientos", unit="registro")

    for appointment in appointments:
        cod_sede = appointment.branchCode
        cod_cups = appointment.cupsCode

        # Buscar el departamento correspondiente al CodSede
        departamento = next(
            (item["departamento"] for item in departament_data if item["codigo_sede"] == cod_sede),
            None
        )

        # Validar si cumple con las reglas
        if departamento:
            # Verificar si el par (departamento, cups) está en el conjunto
            if (departamento, cod_cups) in white_list_set:
                # Cumple con las reglas
                new_state = None
            else:
                # No cumple con la regla del cups + departamento
                new_state = "capita"
        else:
            # No cumple con la regla del codigo_sede
            new_state = "capita"

        # Actualizar el estado en la base de datos
        stmt = (
            update(Appointment)
            .where(Appointment.id == appointment.id)
            .values(state=new_state)
        )
        session.execute(stmt)

        progressBar.update(1)

    progressBar.close()

    session.commit()
    print(f"Se procesaron {len(appointments)} registros.")


def updateAppointmentsWithAuthorization(session: Session):
    """
    Consulta agendamientos de sedes específicas en estado 'inicial' y los actualiza 
    con autorización si el servicio counterCups retorna datos válidos (disponibilidad de uso de cups).
    """
    
    # Consultar agendamientos de las sedes específicas en estado 'inicial'
    stmt = (
        select(Appointment)
        .where(
            Appointment.branchCode.in_(['030103', '010126']),
            Appointment.state == 'inicial'
        )
        .order_by(Appointment.appointmentDate.asc())
    )
    
    appointments = session.exec(stmt).all()
    
    # Contadores
    updated = 0
    not_updated = 0
    total_processed = len(appointments)
    
    progressBar = tqdm(
        total=total_processed,
        desc="Verificando autorizaciones",
        unit="registro"
    )
    
    for appointment in appointments:
        # Consultar disponibilidad con counterCups
        authorization_data = counterCups(
            numero_documento_paciente=appointment.identificationNumber,
            codigo_cup=appointment.cupsCode
        )
        
        # Revisar el código de estado HTTP de la respuesta
        response_status = getattr(authorization_data, 'status_code', None)
        if response_status is None and hasattr(authorization_data, 'get'):
            response_status = authorization_data.get('status_code')
        # Si la función counterCups retorna el objeto response, usar .status_code
        # Si retorna un dict, usar .get('status_code')
        if response_status == 201:
            numero_autorizacion = authorization_data.get("numero_autorizacion")
            numero_cita = authorization_data.get("numero_cita")
            stmt = (
                update(Appointment)
                .where(Appointment.id == appointment.id)
                .values(
                    authorizationNumber=numero_autorizacion,
                    appointmentNumber=numero_cita,
                    state="autorización gestionado"
                )
            )
            session.execute(stmt)
            updated += 1
        elif response_status in [404, 402, 409]:
            stmt = (
                update(Appointment)
                .where(Appointment.id == appointment.id)
                .values(state="sin historico")
            )
            session.execute(stmt)
            not_updated += 1
        else:
            stmt = (
                update(Appointment)
                .where(Appointment.id == appointment.id)
                .values(state="sin historico")
            )
            session.execute(stmt)
            not_updated += 1
        progressBar.update(1)
        session.commit()
    
    progressBar.close()
    print(f"Actualizados: {updated}, No actualizados: {not_updated}, Total procesados: {total_processed}")