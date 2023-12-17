from flask_cors import CORS
from flask import Flask, render_template
from flask_socketio import SocketIO
import time

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret!"
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app, resources={r"/*": {"origins": "*"}})
wait_for_velocity = False


@app.route("/score", methods=["POST"])
def score():
    print("score")
    return "score"


@app.route("/hello")
def hello():
    print("hello")
    return "hello"


@app.route("/velocity", methods=["GET"])
def getVelocity():
    global wait_for_velocity
    wait_for_velocity = True
    print("wait for velocity!")
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


@socketio.on("shoot")
def updateVelocity(data):
    global wait_for_velocity
    print("wait for velocity: ", wait_for_velocity)
    print(data)
    velocity = [int(data["ax"]) / 10, int(data["ay"]) / 10, int(data["az"]) / 10]

    if wait_for_velocity:
        socketio.emit("velocity", velocity)


if __name__ == "__main__":
    socketio.run(
        app, use_reloader=True, log_output=False, port=5328, host="192.168.0.14"
    )
