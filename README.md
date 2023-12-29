# Air Basketball

2023 Fall NTU embedded system lab final project.

- The [Slide](https://docs.google.com/presentation/d/10FJLbdmAahGNAibwFPRSRF8Uz-kPOEbkjXuO1UVXhOI/edit?usp=sharing) of the project.
- The [Demo Video](https://youtu.be/WFOLIlUiic4) of the project.

## Project Structure

```
.
├── source
│   ├── main.cpp
├── websocket
│   ├── socket-server.py
│   ├── canva.py
├── server
│   ├── index.py
├── airbasket
│   ├── pages
│   │   ├── index.js
│   ├── hand-pose-detection
│   │   ├── index.js
├── README.md

```

## Project Description

We use the STM32L4 Discovery Kit IoT Node to develop an air basketball game. The player can use his/her hand to simulate the shooting process. The accelerometer on the board will collect the data and send it to the server. The server will use the data to simulate the shooting process and send the result back to the board. The board will use the result to control the buzzer to notify the player if goal or not.

For better user experience, we also develop a web page to show the result of the simulation. A user has to ask a ball to shoot on the web page through the hand pose detection.The web page will show the position of the ball and the result of the simulation. A user can also change the difficulty level on the web page. The difficulty level will be sent to the board and the board will change the led mode to indicate the difficulty level.

## How to Start

1. Open servers

   1. Open flask http server
      1. Open the folder "eslab-final-project"
      2. `cd server`
      3. `python index.py`
   2. Open stm socket server
      1. Open the folder "eslab-final-project"
      2. `cd websocket`
      3. `python socket-server.py`

2. Open Mbed Studio

   1. import the program from URL `https://github.com/ARMmbed/mbed-os-example-sockets`
   2. Set the "use-tls-socket" to false in `mbed_app.json`
   3. Modify the AP's SSID and password in `mbed_app.json`
   4. Download the driver "BSP_B-L475E-IOT01" and add it to the project
   5. Add the necessary libraries to the project
   6. Compile and flash the program to the board
   7. Plug the buzzer to the board (D11)
   8. (Optional) Use charger to power the board instead of connecting to the computer

3. Open the web page
   1. option1: use deployed frontend
      1. open [air-basketball](https://air-basketball.vercel.app/) on your browser and allow the camera access
      2. choose the mode (easy, normal, hard) and click the "Start game" button
      3. use your hand to ask a ball to shoot
      4. the result of the simulation will be shown on the web page
   2. option2: use local
      1. Open the folder "eslab-final-project"
      2. `cd airbasket`
      3. `yarn`
      4. set url in `.env.development` to your server url
      5. `yarn dev`

## Motivation

Since every people who love basketball would like to shoot the ball everywhere, as if they were NBA players, and hit the 3-pt shot, so we want to make the dream come true. It can also improve the shooting position and angles.


## Technologies Used

#### Websocket

- description
  - use **TCP/IP protocol**
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
  - use **CMSIS-DSP library**
- purpose
  - filter out the noise of the accelerometer data
- scenario
  - get the accelerometer data from the board
- detail
  - use `arm_fir_f32` function
  - use the specifically designed low pass filter, which _Nyquist frequency_ is 5Hz and _Cutoff frequency_ is 2.5Hz

#### BSP (Board Support Package)

- description
  - use **BSP library**
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
  - use **PWM library**
  - use `pwmout.period` and `pwmout.write` function
- purpose
  - control the buzzer
- scenario
  - use to notify the player if goal or not
  - one long beep for goal, two short beeps for not goal

#### Multi-threading

- description
  - use **Thread library**
  - use `Thread` function
- purpose
  - run the tasks concurrently
- scenario
  - simulate the shooting process
  - set the position of the ball

#### VPython
- description
  - provide a scene to see the movemant of the ball
- purpose
  - to simulate the process of shooting the ball and display

#### Next.js

- description
  - a javascript, web fullstack web framework
  - in this project, we use it as frontend framework
- purpose
  - provide delicate, user-friendly UI for users to select mode, handedness
  - display 3D shooting animation, score, time ...

#### Flask

- description
  - a python, backend framework
- purpose
  - serve as http server for web frontend, socket server for communication relay between STM32 and browser

#### Vercel

- purpose
  - deploy our frontend service
  - view at [air-basketball](https://air-basketball.vercel.app/)

#### Hand Pose Detection

- description
  - use google mediapipe js to achieve in-browser gesture recognition
- purpose
  - detect the gesture for _asking for the ball_
  - the ball will fly to your hand once the gesture is detected

## New Features (after Demo)

- Play a song when goal using PWM
  - replace the original buzzer sound (one long beep for goal)
  - play a 3-second song when goal

- Add a person as a player
  - ![image](https://github.com/Alanhsiu/eslab-final-project.github.io/assets/91511424/0b6b7f86-7f76-43db-8d91-2d48a6d85825)

## Reference

- Class Slides
- [STM32L4 Discovery Kit IoT Node](https://os.mbed.com/platforms/ST-Discovery-L475E-IOT01A/)
- [STM32 Nucleo Driving Buzzer with Notes](https://community.st.com/t5/stm32-mcus-products/stm32-nucleo-driving-buzzer-with-notes/td-p/290164)
- [python-socketio](https://python-socketio.readthedocs.io/en/stable/)
