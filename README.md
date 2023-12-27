# Air Basketball
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
## What is the Project



## How to Run the Program
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

#### Websocket
- description
  - use TCP/IP protocol
  - use socket/socketio library
- purpose
  - communication between STM32 and the server
  - communication between the server and the web server
- scenario
  - STM32 sends the accelerometer data to the server
  - STM32 receives the result of the simulation from the server
  - STM32 sends the difficulty level to the server
  - STM32 sends heart beat to the server
  - The server sends the data to the web server
- detail
  - use `s.setsockopt` to reuse the address
  - use `s.settimeout` to set the timeout
  - use **heartbeat** to check if the connection is still alive

#### Digital Signal Processing (DSP)
- description
  - use CMSIS-DSP library
  - use `arm_fir_f32` function
- purpose
  - filter out the noise
- scenario
  - get the accelerometer data
- detail
  - use the specific low pass filter, which Nyquist frequency is 5Hz and Cutoff frequency is 2.5Hz

#### BSP (Board Support Package)
- description
  - use BSP library
  - use `BSP_ACCELERO_AccGetXYZ` function
- purpose
  - use the sensors on the board to get the accelerometer data
- scenario
  - collect the accelerometer data

#### Semaphores
- purpose
  - synchronize the tasks
- scenario
  - use to change led modes to indicate the difficulty level
  - use keyword `volatile` to prevent the compiler from optimizing the code

#### PWM (Pulse Width Modulation)
- description
  - use PWM library
  - use `pwmout.period` and `pwmout.write` function
- purpose
  - control the buzzer
- scenario
  - use to notify the player if goal or not
  - one long beep for goal, two short beeps for not goal

#### Multi-threading
- description
  - use Thread library
  - use `Thread` function
- purpose
  - run the tasks concurrently
- scenario
  - simulate the shooting process
  - set the position of the ball

## New Features (after Demo)
- Play a song when goal using PWM
  - replace the original buzzer sound (one long beep for goal)
  - play a 3-second song when goal