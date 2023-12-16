import socket
import json
import matplotlib.pyplot as plt
import math
from time import sleep
from canva import basketball
import threading


# Initialize plotting
plt.ion()
fig, axs = plt.subplots(2, 1, figsize=(10, 10))  # Four subplots

def plot_data(ax, data_x, data_y, data_z, label, ylim):
    ax.clear()
    ax.plot(data_x, label=f'{label} X', color='r')
    ax.plot(data_y, label=f'{label} Y', color='g')
    ax.plot(data_z, label=f'{label} Z', color='b')
    ax.legend(loc='upper left')
    ax.set_ylim(ylim)

def calculate_elevation_angle(ax, ay, az):
    # Calculate elevation angle with respect to the horizontal plane
    return math.degrees(math.atan2(math.sqrt(ax**2 + ay**2), az))

def low_pass_filter(new_val, prev_val, alpha=0.9):
    # Simple low pass filter
    return new_val
    # return alpha * new_val + (1 - alpha) * prev_val

def process_data(json_data, buffers, angles, last_values):
    try:
        obj = json.loads(json_data)
        # Update data buffers with low pass filtering
        for key, value in obj.items():
            filtered_value = low_pass_filter(value, last_values[key])
            buffers[key].append(filtered_value)
            last_values[key] = filtered_value
            if len(buffers[key]) > 50:
                buffers[key].pop(0)

        ax, ay, az = last_values['ax'], last_values['ay'], last_values['az']
        elevation_angle = calculate_elevation_angle(ax, ay, az)
        angles['elevation'].append(elevation_angle)
        if len(angles['elevation']) > 50:
            angles['elevation'].pop(0)

        return True
    except json.JSONDecodeError:
        return False

# Data buffers
buffers = {
    'ax': [], 'ay': [], 'az': [],
    'wx': [], 'wy': [], 'wz': [],
    'mx': [], 'my': [], 'mz': []
}

# Last values for low pass filter initialization
last_values = {key: 0 for key in buffers.keys()}

# Angles buffer for storing only the elevation angle
angles = {'elevation': []}

HOST = '192.168.0.2'
PORT = 6669

ball = basketball()

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind((HOST, PORT))
    s.listen()
    print("Server starting, located at:", (HOST, PORT))
    conn, addr = s.accept()
    print("Connected to", addr)
    buffer = ''
    while True:
        data = conn.recv(1024).decode('utf-8')
        buffer += data

        while '}' in buffer:
            json_obj, _, buffer = buffer.partition('}')
            json_obj += '}'
            print(json_obj)
            
            if len(angles['elevation']) > 1 and angles['elevation'][-2] > 120 and angles['elevation'][-1] <= 120: # detect shooting
                t = threading.Thread(target=ball.shoot, args=(int(buffers['ax'][-1]), int(buffers['ay'][-1]), int(buffers['az'][-1]))) # create a thread to start the animation
                t.start()

            if process_data(json_obj, buffers, angles, last_values):
                # Plotting acceleration, angular velocity, magnetic field, and elevation angle
                plot_data(axs[0], buffers['ax'], buffers['ay'], buffers['az'], 'Acceleration', ylim=(-2000, 2000))
                # plot_data(axs[1], buffers['wx'], buffers['wy'], buffers['wz'], 'Angular Velocity', ylim=(-10000, 10000))
                # plot_data(axs[2], buffers['mx'], buffers['my'], buffers['mz'], 'Magnetic Field', ylim=(-1000, 1000))
                # Plotting the elevation angle
                plot_data(axs[1], angles['elevation'], [], [], 'Elevation Angle', ylim=(0, 180))
                plt.pause(0.01)
                
            
