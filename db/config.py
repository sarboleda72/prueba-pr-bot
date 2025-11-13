from os import environ
from dotenv import load_dotenv

class SettingsPostgresql:
    """ _summary_
    """
    load_dotenv()
    POSTGRES_DB: str = environ["POSTGRES_DB"]
    POSTGRES_USER: str = environ["POSTGRES_USER"]
    POSTGRES_PASSWORD: str = environ["POSTGRES_PASSWORD"]
    POSTGRES_SERVER: str = environ["POSTGRES_SERVER"]
    POSTGRES_PORT: str = environ["POSTGRES_PORT"]
    DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}:{POSTGRES_PORT}/{POSTGRES_DB}"