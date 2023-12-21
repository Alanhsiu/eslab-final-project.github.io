from app import socketio, app
import os

if __name__ == "__main__":
    socketio.run(
        app=app,
        host="0.0.0.0",
        port=os.environ.get("FLASK_SERVER_PORT"),
        debug=True,
        use_reloader=True,
        log_output=True,
    )
