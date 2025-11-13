from datetime import date, datetime, time
from typing import Optional
from sqlmodel import Field, SQLModel, SQLModel
from sqlalchemy import Column, String, Integer, Date, Time, BigInteger, DateTime, Boolean

# Modelo para la tabla Pacientes
class Patient(SQLModel, table=True):
    __tablename__ = "pacientes" 
     
    id: Optional[int] = Field(default=None, primary_key=True)
    documentType: str = Field(sa_column=Column("tipo_documento", String(length=5)))
    identificationNumber: str = Field(sa_column=Column("numero_identificacion", String(length=15)))
    firstName: str = Field(sa_column=Column("primer_nombre", String(length=50)))
    middleName: Optional[str] = Field(default=None, sa_column=Column("segundo_nombre", String(length=50)))
    lastName: str = Field(sa_column=Column("primer_apellido", String(length=50)))
    secondLastName: Optional[str] = Field(default=None, sa_column=Column("segundo_apellido", String(length=50)))
    birthDate: date = Field(sa_column=Column("fecha_nacimiento", Date))
    age: int = Field(sa_column=Column("edad", Integer))
    gender: str = Field(sa_column=Column("sexo", String(length=1)))
    address: str = Field(sa_column=Column("direccion", String(length=100)))
    phone: str = Field(sa_column=Column("telefono", String(length=30)))

# Modelo para la tabla Agendamientos
class Appointment(SQLModel, table=True):
    __tablename__ = "agendamientos"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    companyCode: str = Field(sa_column=Column("codigo_empresa", String(length=10)))
    companyName: str = Field(sa_column=Column("nombre_empresa", String(length=100)))
    companyNit: str = Field(sa_column=Column("nit_empresa", String(length=20)))
    branchCode: str = Field(sa_column=Column("codigo_sede", String(length=10)))
    branchName: str = Field(sa_column=Column("nombre_sede", String(length=100)))
    appointmentNumber: int = Field(sa_column=Column("numero_cita", BigInteger))
    reservationDate: date = Field(sa_column=Column("fecha_reserva", Date))
    desiredDate: datetime = Field(sa_column=Column("fecha_deseada", DateTime))
    appointmentDate: datetime = Field(sa_column=Column("fecha_cita", DateTime))
    appointmentTime: time = Field(sa_column=Column("hora_cita", Time))
    documentType: str = Field(sa_column=Column("tipo_documento", String(length=5)))
    identificationNumber: str = Field(sa_column=Column("numero_identificacion", String(length=15)))
    contractCode: str = Field(sa_column=Column("codigo_contrato", String(length=20)))
    statusCode: str = Field(sa_column=Column("codigo_estado", String(length=1)))
    statusName: str = Field(sa_column=Column("nombre_estado", String(length=50)))
    cupsCode: str = Field(sa_column=Column("codigo_cups", String(length=20)))
    cupsHistory: str = Field(sa_column=Column("historial_cups", String(length=20)))
    cupsName: str = Field(sa_column=Column("nombre_cups", String(length=500)))
    folio: str = Field(sa_column=Column("folio", String(length=5)))
    entry: str = Field(sa_column=Column("ingreso", String(length=5)))
    typeOrder: str = Field(sa_column=Column("tipo", String(length=20)))
    authorization_sent: bool = Field(sa_column=Column("autorizacion_enviada", Boolean))
    authorizationNumber: str = Field(default=None, sa_column=Column("numero_autorizacion", String(length=50)))
    orderMongo: str = Field(default=None, sa_column=Column("orden_mongo", String(length=100)))
    attentionDate: datetime = Field(sa_column=Column("fecha_atencion", DateTime))
    state: str = Field(
        sa_column=Column("estado", String(length=50)),
        regex="^(inicial|historia clinica|autorización gestionado|expirado|cancelada-incumplida|capita|gestionado previamente)$"
    )
    
class Department(SQLModel, table=True):
    __tablename__ = "departamentos"

    id: Optional[int] = Field(default=None, primary_key=True)
    branchName: str = Field(sa_column=Column("nombre_sede", String(length=255)))
    department: str = Field(sa_column=Column("departamento", String(length=100)))
    branchCode: str = Field(sa_column=Column("codigo_sede", String(length=20), unique=True))

class Event(SQLModel, table=True):
    __tablename__ = "eventos"

    id: Optional[int] = Field(default=None, primary_key=True)
    branchCode: str = Field(sa_column=Column("codigo_sede", String(length=20)))
    cups: str = Field(sa_column=Column("cups", String(length=20)))

class Message(SQLModel):
    msg: str
    status_code: int

class HttpMessageException(SQLModel):
    status_code: int
    detail: str