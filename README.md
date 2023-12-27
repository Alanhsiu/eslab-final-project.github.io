# Air Basketball
2023 Fall NTU embedded system lab final project.

* The [Slide]([https://do](https://docs.google.com/presentation/d/10FJLbdmAahGNAibwFPRSRF8Uz-kPOEbkjXuO1UVXhOI/edit#slide=id.g2a94ed5eb7c_2_174)) of the project.
* The [Demo Video](https://youtu.be/WFOLIlUiic4) of the project.

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
## Project Description
We use the STM32L4 Discovery Kit IoT Node to develop an air basketball game. The player can use his/her hand to simulate the shooting process. The accelerometer on the board will collect the data and send it to the server. The server will use the data to simulate the shooting process and send the result back to the board. The board will use the result to control the buzzer to notify the player if goal or not.

For better user experience, we also develop a web page to show the result of the simulation. A user has to ask a ball to shoot on the web page through the hand pose detection.The web page will show the position of the ball and the result of the simulation. A user can also change the difficulty level on the web page. The difficulty level will be sent to the board and the board will change the led mode to indicate the difficulty level.


## How to Start
1. Open Mbed Studio
   1. import the program from URL `https://github.com/ARMmbed/mbed-os-example-sockets`
   2. Set the "use-tls-socket" to false in `mbed_app.json`
   3. Modify the AP's SSID and password in `mbed_app.json`
   4. Download the driver "BSP_B-L475E-IOT01" and add it to the project
   5. Add the necessary libraries to the project
   6. Compile and flash the program to the board
   7. Plug the buzzer to the board (D11)
   8. (Optional) Use charger to power the board instead of connecting to the computer

2. Open Visual Studio Code
   1. Open the folder "eslab-final-project"
   2. `cd websocket`
   3. `python socket-server.py`

3. Open the web page 
   1. open [air-basketball](https://air-basketball.vercel.app/) on your browser and allow the camera access
   2.  choose the mode (easy, normal, hard) and click the "Start game" button
   3.  use your hand to ask a ball to shoot
   4.  the result of the simulation will be shown on the web page
  


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
  - use **heartbeat** to check if the connection is still alive (send a message to the server every 5 seconds)

#### Digital Signal Processing (DSP)
- description
  - use CMSIS-DSP library
  - use `arm_fir_f32` function
- purpose
  - filter out the noise
- scenario
  - get the accelerometer data
- detail
  - use the specific low pass filter, which _Nyquist frequency_ is 5Hz and _Cutoff frequency_ is 2.5Hz

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

#### VPython

#### Next.js

#### Flask

#### Vercel

#### Hand Pose Detection


## New Features (after Demo)
- Play a song when goal using PWM
  - replace the original buzzer sound (one long beep for goal)
  - play a 3-second song when goal