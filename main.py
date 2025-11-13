import urllib3
import logging
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from models.schemas import Message
from routes import agenda
from core.auto_execution import start_scheduler
import threading

# Deshabilitar las advertencias de verificación SSL
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Configura el nivel de logging para SQLAlchemy
logging.getLogger("sqlalchemy.engine.Engine").setLevel(logging.WARNING) 
logging.getLogger("sqlalchemy.engine.Engine").disabled = True

app = FastAPI(root_path="/api/v1", version="0.0.1", title="API OCGN Zentria")

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def inicio():
    return Message(msg="Inicio OK", status_code=status.HTTP_200_OK)

app.include_router(agenda.router)

#threading.Thread(target=start_scheduler, daemon=True).start()