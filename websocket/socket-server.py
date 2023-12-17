import socket
import json
import matplotlib.pyplot as plt
import math
import threading
import time
import socketio

from canva import basketball

HOST = "192.168.0.2"
PORT = 6666
sio = socketio.SimpleClient()
sio.connect("http://192.168.0.14:5328", transports=["websocket"])

sio = socketio.SimpleClient()
sio.connect("http://192.168.0.14:5328", transports=["websocket"])

# plt.ion() # Initialize plotting
fig, axs = plt.subplots(2, 1, figsize=(10, 10))  # 2 subplots


def plot_acc_data(ax, data_x, data_y, data_z, label, ylim):
    ax.clear()
    ax.plot(data_x, label=f"{label} X", color="r")
    ax.plot(data_y, label=f"{label} Y", color="g")
    ax.plot(data_z, label=f"{label} Z", color="b")
    ax.legend(loc="upper left")
    ax.set_ylim(ylim)


def plot_elevation_angle(ax, data, label, ylim):
    ax.clear()
    ax.plot(data, label=label, color="r")
    ax.legend(loc="upper left")
    ax.set_ylim(ylim)


def calculate_elevation_angle(ax, ay, az):
    # Calculate elevation angle with respect to the horizontal plane
    return math.degrees(math.atan2(math.sqrt(ax**2 + ay**2), az))


def low_pass_filter(new_val, prev_val, alpha=0.9):
    return alpha * new_val + (1 - alpha) * prev_val


def process_data(json_data, buffers, angles, last_values):
    try:
        obj = json.loads(json_data)
        # Update data buffers with low pass filtering
        for key, value in obj.items():
            # filtered_value = low_pass_filter(value, last_values[key])
            filtered_value = value
            buffers[key].append(filtered_value)
            last_values[key] = filtered_value
            if len(buffers[key]) > 50:
                buffers[key].pop(0)

        ax, ay, az = last_values["ax"], last_values["ay"], last_values["az"]
        elevation_angle = calculate_elevation_angle(ax, ay, az)
        # elevation_angle = last_values['d']
        angles["elevation"].append(elevation_angle)
        if len(angles["elevation"]) > 50:
            angles["elevation"].pop(0)

        return True
    except json.JSONDecodeError:
        return False


class ThreadWithReturnValue(threading.Thread):
    def __init__(
        self, group=None, target=None, name=None, args=(), kwargs={}, Verbose=None
    ):
        threading.Thread.__init__(self, group, target, name, args, kwargs)
        self._return = None

    def run(self):
        if self._target is not None:
            self._return = self._target(*self._args, **self._kwargs)

    def join(self, *args):
        threading.Thread.join(self, *args)
        return self._return


# Data buffers
buffers = {"ax": [], "ay": [], "az": []}

# Last values for low pass filter initialization
last_values = {key: 0 for key in buffers.keys()}

# Angles buffer for storing only the elevation angle
angles = {"elevation": []}

ball = basketball()


def process_data_and_send_response(json_data, buffers, angles, last_values, conn):
    if process_data(json_data, buffers, angles, last_values):
        t = ThreadWithReturnValue(
            target=ball.shoot,
            args=(
                int(buffers["ax"][-1]),
                int(buffers["ay"][-1]),
                int(buffers["az"][-1]),
            ),
        )
        sio.emit(
            "shoot",
            {
                "ax": int(buffers["ax"][-1]),
                "ay": int(buffers["ay"][-1]),
                "az": int(buffers["az"][-1]),
            },
        )
        print("start")
        t.start()
        print("end")
        result = t.join()
        print(result)

        if result:
            conn.sendall("success".encode("utf-8"))
            print("send success")
        else:
            conn.sendall("fail".encode("utf-8"))
            print("send fail")
    else:
        conn.sendall("fail".encode("utf-8"))


with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    s.bind((HOST, PORT))
    s.listen()
    print("Server starting, located at:", (HOST, PORT))

    while True:
        conn, addr = s.accept()
        conn.settimeout(5)
        print("Connected to", addr)
        buffer = ""
        last_received_time = time.time()

        try:
            while True:
                try:
                    data = conn.recv(1024).decode("utf-8")
                    if data:
                        buffer += data
                        last_received_time = time.time()

                    while "}" in buffer:
                        json_obj_str, _, buffer = buffer.partition("}")
                        json_obj_str += "}"

                        try:
                            json_obj = json.loads(json_obj_str)
                            if json_obj.get("type") == "heartbeat":
                                print("Heartbeat received")
                                continue
                        except json.JSONDecodeError:
                            print("Invalid JSON")
                            continue

                        print(json_obj_str)

                        process_data_and_send_response(
                            json_obj_str, buffers, angles, last_values, conn
                        )
                        # plot_acc_data(axs[0], buffers['ax'], buffers['ay'], buffers['az'], 'Acceleration', ylim=(-2000, 2000))
                        # plot_elevation_angle(axs[1], angles['elevation'], 'Elevation Angle', ylim=(0, 180))
                        # plt.pause(0.001)

                except socket.timeout:
                    if (
                        time.time() - last_received_time > 3
                    ):  # timeout_period set to 3 seconds
                        print("Client disconnected due to timeout")
                        break

        except Exception as e:
            print(f"Error: {e}")
        finally:
            conn.close()
            print("Connection closed. Waiting for new connection...")
