# eslab-final-project
2023 Fall NTU embedded system lab final project

## Project Description
Air basketball game developed on STM32L4 Discovery Kit IoT Node.

## Project Structure
```
.
├── source
│   ├── main.cpp
├── websocket
│   ├── socket-server.py
│   ├── canva.py
├── air_basketball
│   ├── pages
│   │   ├── index.js
│   ├── hand-pose-detection
│   │   ├── indes.js
├── README.md

```

## How to Run
1. Open Mbed Studio and import the program from URL `https://github.com/ARMmbed/mbed-os-example-sockets`
   1. Set the "use-tls-socket" to false in `mbed_app.json`
   2. Modify the AP's SSID and password in `mbed_app.json`
   3. Download the driver "BSP_B-L475E-IOT01" and add it to the project
   4. Add the necessary libraries to the project
2. Compile and flash the program to the board
3. Run the server
   1. `cd websocket`
   2. `python socket-server.py`


## Technologies Used
- Websocket: communication between STM32 and the server
- BSP (Board Support Package): collect accelerometer data
- Semaphores: control the access of shared resources (LEDs)
- Low Pass Filter: filter out the noise of accelerometer data



