from fastapi import WebSocket, WebSocketDisconnect
from app.websocket.manager import manager


async def websocket_endpoint(websocket: WebSocket):
    """Endpoint WebSocket para notificações em tempo real"""
    await manager.connect(websocket)
    try:
        while True:
            # Mantém a conexão aberta e aguarda mensagens
            data = await websocket.receive_text()
            # Você pode processar mensagens recebidas do cliente aqui, se necessário
    except WebSocketDisconnect:
        manager.disconnect(websocket)
