from sqlmodel import create_engine, Session
from .config import SettingsPostgresql

engine = create_engine(
    SettingsPostgresql.DATABASE_URL,
    pool_pre_ping=True,  # Verifica la conexión antes de usarla
    pool_size=10,  # Reducido para Azure
    max_overflow=20,  # Reducido para Azure
    pool_recycle=3600,  # Recicla conexiones cada hora (evita timeouts)
    pool_timeout=30,  # Timeout para obtener conexión del pool
    connect_args={
        "connect_timeout": 10,  # Timeout de conexión inicial
        "options": "-c statement_timeout=300000"  # 5 minutos timeout por query
    }
)

def getDB():
    with Session(autoflush=False, autocommit=False, bind=engine) as session:
        yield session