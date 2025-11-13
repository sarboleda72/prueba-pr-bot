from sqlmodel import Session
from db.db_postgres import engine
from apscheduler.schedulers.background import BackgroundScheduler
from models import crud
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def schedule_bulk_insert():
    """Ejecuta bulkInsertAgenda con manejo robusto de conexiones"""
    session = None
    try:
        session = Session(engine)
        crud.bulkInsertAgenda(session)
        session.commit()
        logger.info("✅ schedule_bulk_insert completado exitosamente")
    except Exception as e:
        logger.error(f"❌ Error en schedule_bulk_insert: {e}")
        if session:
            try:
                session.rollback()
            except Exception as rollback_error:
                logger.error(f"Error en rollback: {rollback_error}")
    finally:
        if session:
            try:
                session.close()
            except Exception as close_error:
                logger.error(f"Error cerrando sesión: {close_error}")


def schedule_update_appointments_status():
    """Ejecuta updateAppointmentsStatus con manejo robusto de conexiones"""
    session = None
    try:
        session = Session(engine)
        crud.updateAppointmentsStatus(session)
        session.commit()
        logger.info("✅ schedule_update_appointments_status completado exitosamente")
    except Exception as e:
        logger.error(f"❌ Error en schedule_update_appointments_status: {e}")
        if session:
            try:
                session.rollback()
            except Exception as rollback_error:
                logger.error(f"Error en rollback: {rollback_error}")
    finally:
        if session:
            try:
                session.close()
            except Exception as close_error:
                logger.error(f"Error cerrando sesión: {close_error}")


def schedule_update_appointments_status_general():
    """Ejecuta updateAppointmentsStatusGeneral con manejo robusto de conexiones"""
    session = None
    try:
        session = Session(engine)
        crud.updateAppointmentsStatusGeneral(session)
        session.commit()
        logger.info("✅ schedule_update_appointments_status_general completado exitosamente")
    except Exception as e:
        logger.error(f"❌ Error en schedule_update_appointments_status_general: {e}")
        if session:
            try:
                session.rollback()
            except Exception as rollback_error:
                logger.error(f"Error en rollback: {rollback_error}")
    finally:
        if session:
            try:
                session.close()
            except Exception as close_error:
                logger.error(f"Error cerrando sesión: {close_error}")


def schedule_update_folio_entry():
    """Ejecuta updateAppointmentsFolio con manejo robusto de conexiones"""
    session = None
    try:
        session = Session(engine)
        crud.updateAppointmentsFolio(session)
        session.commit()
        logger.info("✅ schedule_update_folio_entry completado exitosamente")
    except Exception as e:
        logger.error(f"❌ Error en schedule_update_folio_entry: {e}")
        if session:
            try:
                session.rollback()
            except Exception as rollback_error:
                logger.error(f"Error en rollback: {rollback_error}")
    finally:
        if session:
            try:
                session.close()
            except Exception as close_error:
                logger.error(f"Error cerrando sesión: {close_error}")


def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(schedule_bulk_insert, "interval", hours=1)
    #scheduler.add_job(schedule_update_appointments_status, "interval", hours=1)
    scheduler.add_job(schedule_update_folio_entry, "interval", hours=1)
    scheduler.add_job(schedule_update_appointments_status_general, "interval", hours=1)
    scheduler.start()
