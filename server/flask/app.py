from flask_cors import CORS
from flask import Flask, request, jsonify
from flask_socketio import SocketIO

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret!"
socketio = SocketIO(app, cors_allowed_origins=["http://127.0.0.1:80"])
CORS(app, resources={r"/*": {"origins": "*"}})
wait_for_velocity = False


@app.route("/")
def hello():
    return "Hello World!"


@app.route("/cache-me")
def cache():
    return "nginx will cache this response"


@app.route("/info")
def info():
    resp = {
        "connecting_ip": request.headers["X-Real-IP"],
        "proxy_ip": request.headers["X-Forwarded-For"],
        "host": request.headers["Host"],
        "user-agent": request.headers["User-Agent"],
    }

    return jsonify(resp)


@app.route("/flask-health-check")
def flask_health_check():
    return "success"


@app.route("/score", methods=["GET"])
def score():
    print("score")
    return "score"


@app.route("/expire")
def expire():
    print("expire")
    return "expire"


@app.route("/velocity", methods=["GET"])
def getVelocity():
    global wait_for_velocity
    wait_for_velocity = True
    print("wait for velocity!")
    socketio.emit("velocity", [-2000, 0, 1500])
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
    velocity = [int(data["ax"]), int(data["ay"]), int(data["az"])]

    if wait_for_velocity:
        socketio.emit("velocity", velocity)


# if __name__ == "__main__":
#     socketio.run(app, use_reloader=True, log_output=False, port=5328, host="127.0.0.1")
