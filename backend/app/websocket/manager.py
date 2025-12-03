from fastapi import WebSocket
from typing import List
import json


class ConnectionManager:
    """Gerenciador de conexões WebSocket"""
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        """Aceita uma nova conexão WebSocket"""
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        """Remove uma conexão WebSocket"""
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        """Envia uma mensagem para todas as conexões ativas"""
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                disconnected.append(connection)
        
        # Remove conexões que falharam
        for connection in disconnected:
            if connection in self.active_connections:
                self.active_connections.remove(connection)


# Instância global do gerenciador
manager = ConnectionManager()
