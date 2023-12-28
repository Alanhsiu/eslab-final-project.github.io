from flask_cors import CORS
from flask import Flask, request, jsonify
from flask_socketio import SocketIO
import time

app = Flask(__name__)
socketio = SocketIO(
    app,
    cors_allowed_origins="*",
)
CORS(app, resources={r"/*": {"origins": "*"}})
wait_for_velocity = False


@app.route("/score", methods=["GET"])
def score():
    print("score")
    return "score"


@app.route("/expire")
def expire():
    print("expire")
    return "expire"


@app.route("/mode", methods=["POST"])
def mode():
    print(request.json)
    socketio.emit("mode", request.json)
    return "mode"


@app.route("/velocity", methods=["GET"])
def getVelocity():
    global wait_for_velocity
    wait_for_velocity = True
    print("wait for velocity!")
    # socketio.emit("velocity", [-2000, 0, 1500])
    return "wait for velocity!"


@socketio.on("json")
def handle_json(json):
    print("received json: " + str(json))


@socketio.on("message")
def handle_message(data):
    print("received message: " + data)


@socketio.on("connect")
def connect():
    print("connected")


@socketio.on("level")
def twothree(data):
    print("level")
    socketio.emit("level", data["level"])


@socketio.on("shoot")
def updateVelocity(data):
    global wait_for_velocity
    print("wait for velocity: ", wait_for_velocity)
    print(data)
    velocity = [int(data["ax"]), int(data["ay"]), int(data["az"])]

    if wait_for_velocity:
        socketio.emit("velocity", velocity)
        wait_for_velocity = False


if __name__ == "__main__":
    socketio.run(app, use_reloader=False, log_output=True, port=5328, host="127.0.0.1")
