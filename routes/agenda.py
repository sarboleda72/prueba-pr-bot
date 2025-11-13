from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from sqlalchemy.exc import OperationalError, DBAPIError
from db.db_postgres import getDB
from models import crud
from models.schemas import Message
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="", tags=["Gestión agendamientos"])

@router.post("/insert-agenda", status_code=status.HTTP_200_OK, response_model=Message)
def insertAgendaRoute(db: Session = Depends(getDB)):
    """
    Endpoint para insertar agendamientos y pacientes.
    """
    try:
        crud.bulkInsertAgenda(db)
        logger.info("✅ Agendamientos y pacientes insertados correctamente")
        return Message(msg="Agendamientos y pacientes insertados correctamente.", status_code=status.HTTP_200_OK)
    except OperationalError as e:
        logger.error(f"❌ Error de conexión a base de datos: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Error de conexión a la base de datos. Por favor intente nuevamente."
        )
    except DBAPIError as e:
        logger.error(f"❌ Error de base de datos: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error en la base de datos. Por favor contacte al administrador."
        )
    except Exception as e:
        logger.error(f"❌ Error inesperado al insertar agendamientos: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al insertar agendamientos: {str(e)}"
        )
        
@router.put("/update-medical-general", status_code=status.HTTP_200_OK, response_model=Message)
def updateMedicalGeneralRoute(db: Session = Depends(getDB)):
    """
    Endpoint para actualizar el estado de los agendamientos a 'medicina general' o 'expirado'.
    """
    try:
        crud.updateAppointmentsStatus(db)
        logger.info("✅ Estados de agendamientos actualizados correctamente")
        return Message(msg="Estados de agendamientos actualizados correctamente.", status_code=status.HTTP_200_OK)
    except OperationalError as e:
        logger.error(f"❌ Error de conexión a base de datos: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Error de conexión a la base de datos. Por favor intente nuevamente."
        )
    except DBAPIError as e:
        logger.error(f"❌ Error de base de datos: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error en la base de datos. Por favor contacte al administrador."
        )
    except Exception as e:
        logger.error(f"❌ Error inesperado al actualizar estados: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar estados de agendamientos: {str(e)}"
        )
        
@router.put("/update-folio", status_code=status.HTTP_200_OK, response_model=Message)
def updateFolioRoute(db: Session = Depends(getDB)):
    """
    Endpoint para actualizar los campos ingreso y folio de los agendamientos.
    """
    try:
        crud.updateAppointmentsFolio(db)
        logger.info("✅ Campos ingreso y folio actualizados correctamente")
        return Message(msg="Campos ingreso y folio de agendamientos actualizados correctamente.", status_code=status.HTTP_200_OK)
    except OperationalError as e:
        logger.error(f"❌ Error de conexión a base de datos: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Error de conexión a la base de datos. Por favor intente nuevamente."
        )
    except DBAPIError as e:
        logger.error(f"❌ Error de base de datos: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error en la base de datos. Por favor contacte al administrador."
        )
    except Exception as e:
        logger.error(f"❌ Error inesperado al actualizar folio: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar campos ingreso y folio: {str(e)}"
        )

@router.put("/update-general", status_code=status.HTTP_200_OK, response_model=Message)
def updateGeneralRoute(db: Session = Depends(getDB)):
    """
    Endpoint para actualizar los campos de los agendamientos generales.
    """
    try:
        crud.updateAppointmentsStatusGeneral(db)
        logger.info("✅ Campos de agendamientos generales actualizados correctamente")
        return Message(msg="Campos de agendamientos actualizados correctamente.", status_code=status.HTTP_200_OK)
    except OperationalError as e:
        logger.error(f"❌ Error de conexión a base de datos: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Error de conexión a la base de datos. Por favor intente nuevamente."
        )
    except DBAPIError as e:
        logger.error(f"❌ Error de base de datos: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error en la base de datos. Por favor contacte al administrador."
        )
    except Exception as e:
        logger.error(f"❌ Error inesperado al actualizar campos generales: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar campos de agendamientos: {str(e)}"
        )