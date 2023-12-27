/* Sockets Example
 * Copyright (c) 2016-2020 ARM Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include "mbed.h"
#include "wifi_helper.h"
#include "mbed-trace/mbed_trace.h"
#include <cstdint>
#include <string>
#include <stdio.h>
#include "PinNames.h"

// Sensors drivers present in the BSP library
#include "stm32l475e_iot01_tsensor.h"
#include "stm32l475e_iot01_hsensor.h"
#include "stm32l475e_iot01_psensor.h"
#include "stm32l475e_iot01_magneto.h"
#include "stm32l475e_iot01_gyro.h"
#include "stm32l475e_iot01_accelero.h"

// CMSIS DSP
#include "mbed.h"
#include "arm_math.h"
#include "math_helper.h"


#if MBED_CONF_APP_USE_TLS_SOCKET
#include "root_ca_cert.h"

#ifndef DEVICE_TRNG
#error "mbed-os-example-tls-socket requires a device which supports TRNG"
#endif
#endif // MBED_CONF_APP_USE_TLS_SOCKET

// DSP start
#define TEST_LENGTH_SAMPLES  320
/*

This SNR is a bit small. Need to understand why
this example is not giving better SNR ...

*/
#define SNR_THRESHOLD_F32    75.0f
#define BLOCK_SIZE            32

#if defined(ARM_MATH_MVEF) && !defined(ARM_MATH_AUTOVECTORIZE)
#define NUM_TAPS_ARRAY_SIZE              29
#endif

#define NUM_TAPS              29

#define MAX_BUFFER_SIZE 30  // 定義數據緩存的最大大小
// DSP end

// LED start
#define LD1_ON     {led1 = 1;}
#define LD1_OFF    {led1 = 0;}
#define LD1_TOG    {led1 = !led1;}

#define LD2_ON     {led2 = 1;}
#define LD2_OFF    {led2 = 0;}
#define LD2_TOG    {led2 = !led2;}

#define LD3_ON     {led34.output(); led34 = 1; led3_status = 1;}
#define LD3_OFF    {led34.input(); led3_status = 0;}
#define LD3_TOG    {if (led3_status) LD3_OFF else LD3_ON;}

#define LD4_ON     {led34.output(); led34 = 0; led4_status = 1;}
#define LD4_OFF    {led34.input(); led4_status = 0;}
#define LD4_TOG    {if (led4_status) LD4_OFF else LD4_ON;}
#define LED_DELAY 500ms

Semaphore led_sem(1);
Thread t1;
Thread t2;

DigitalOut led1(LED1);
DigitalOut led2(LED2);

// This object drives both LD3 and LD4 on the board.
// Only one of these LEDs can be driven at a time.
DigitalInOut led34(LED3);
InterruptIn button(BUTTON1);

int led3_status = 0;
int led4_status = 0;

volatile int button_switch = 0;   

void led_thread(void const *name) {
    while (1) {
        led_sem.acquire();
        while (1) {
            if (*((int*)name) == 1) { 
                LD1_TOG;
                ThisThread::sleep_for(LED_DELAY);
                // printf("led1\n");
                if(button_switch % 2 == 1)
                    break;
            }
            else if (*((int*)name) == 2) {
                LD2_TOG;
                ThisThread::sleep_for(LED_DELAY);
                // printf("led2\n");
                if (button_switch % 2 == 0)
                    break;
            }
        }
        LD1_OFF;
        LD2_OFF;
        LD3_OFF;
        LD4_OFF;
        led_sem.release();
    }
}

void button_pressed()
{
    // acts at the first press
    if (button_switch == -1) {
        led_sem.release();
    }
}

void button_released()
{
    ++button_switch;
}
// LED end

// PWM start
#define NOTE_C4  262   //Defining note frequency
#define NOTE_D4  294
#define NOTE_E4  330
#define NOTE_F4  349
#define NOTE_G4  392
#define NOTE_A4  440
#define NOTE_B4  494
#define NOTE_C5  523
#define NOTE_D5  587
#define NOTE_E5  659
#define NOTE_F5  698
#define NOTE_G5  784
#define NOTE_A5  880
#define NOTE_B5  988

PwmOut buzzer(D11);

float notes[] = {       //Note of the song, 0 is a rest/pulse
   NOTE_E4, NOTE_G4, NOTE_A4, NOTE_A4, 0, 
   NOTE_A4, NOTE_B4, NOTE_C5, NOTE_C5, 0, 
   NOTE_C5, NOTE_D5, NOTE_B4, NOTE_B4, 0,
   NOTE_A4, NOTE_G4, NOTE_A4, 0
};
int duration[] = {         //duration of each note (in ms) Quarter Note is set to 250 ms
  125, 125, 250, 125, 125, 
  125, 125, 250, 125, 125,
  125, 125, 250, 125, 125,
  125, 125, 375, 125
};
// PWM end

extern float32_t testInput_f32_1kHz_15kHz[TEST_LENGTH_SAMPLES];
extern float32_t refOutput[TEST_LENGTH_SAMPLES];
static float32_t testOutput[TEST_LENGTH_SAMPLES];

#if defined(ARM_MATH_MVEF) && !defined(ARM_MATH_AUTOVECTORIZE)
static float32_t firStateF32[2 * BLOCK_SIZE + NUM_TAPS - 1];
#else
static float32_t firStateF32[BLOCK_SIZE + NUM_TAPS - 1];
#endif 

const float32_t firCoeffs32[NUM_TAPS_ARRAY_SIZE] = {
    1.55685941e-18,  2.23776078e-03, -2.44338032e-18, -5.21098854e-03,
    4.92735672e-18,  1.20210608e-02, -8.51680662e-18, -2.45173921e-02,
    1.25007954e-17,  4.70107885e-02, -1.60902453e-17, -9.53075386e-02,
    1.85742217e-17,  3.14152600e-01,  4.99227419e-01,  3.14152600e-01,
    1.85742217e-17, -9.53075386e-02, -1.60902453e-17,  4.70107885e-02,
    1.25007954e-17, -2.45173921e-02, -8.51680662e-18,  1.20210608e-02,
    4.92735672e-18, -5.21098854e-03, -2.44338032e-18,  2.23776078e-03,
    1.55685941e-18
};


uint32_t blockSize = BLOCK_SIZE;
uint32_t numBlocks = TEST_LENGTH_SAMPLES/BLOCK_SIZE;

// DSP end
class SocketDemo {
    static constexpr size_t MAX_NUMBER_OF_ACCESS_POINTS = 30;
    static constexpr size_t MAX_MESSAGE_RECEIVED_LENGTH = 200;
    static constexpr size_t REMOTE_PORT = 6666; // CHANGE THIS

public:
    SocketDemo() : _net(NetworkInterface::get_default_instance())
    {
    }

    ~SocketDemo()
    {
        if (_net) {
            _net->disconnect();
        }
    }

    void buzzerPWM(){
        buzzer.period(0.1f); // 4 second period
        buzzer.write(0.0f); // 50% duty cycle, relative to period
    }

    void run()
    {
        LD1_OFF;
        LD2_OFF;
        LD3_ON;

        button.fall(&button_pressed); 
        button.rise(&button_released); // switch led
        const int a1 = 1;
        const int a2 = 2;

        t1.start(callback(led_thread, (void *)&a1));
        t2.start(callback(led_thread, (void *)&a2));

        if (!_net) {
            printf("Error! No network interface found.\r\n");
            return;
        }

        /* if we're using a wifi interface run a quick scan */
        if (_net->wifiInterface()) {
            /* the scan is not required to connect and only serves to show visible access points */
            wifi_scan();

            /* in this example we use credentials configured at compile time which are used by
             * NetworkInterface::connect() but it's possible to do this at runtime by using the
             * WiFiInterface::connect() which takes these parameters as arguments */
        }

        /* connect will perform the action appropriate to the interface type to connect to the network */

        printf("Connecting to the network...\r\n");

        nsapi_size_or_error_t result = _net->connect();
        if (result != 0) {
            printf("Error! _net->connect() returned: %d\r\n", result);
            return;
        }

        print_network_info();

        /* opening the socket only allocates resources */
        result = _socket.open(_net);
        if (result != 0) {
            printf("Error! _socket.open() returned: %d\r\n", result);
            return;
        }

        /* now we have to find where to connect */

        SocketAddress address;

        if (!resolve_hostname(address)) {
            return;
        }

        address.set_port(REMOTE_PORT);

        /* we are connected to the network but since we're using a connection oriented
         * protocol we still need to open a connection on the socket */

        printf("Opening connection to remote port %d\r\n", REMOTE_PORT);

        int retryCount = 0;
        const int maxRetries = 10;

        while(retryCount < maxRetries) {
            result = _socket.connect(address);
            if (result != 0) {
                printf("Retry #%d after failure: %d\r\n", retryCount, result);

                _socket.close(); 
                ThisThread::sleep_for(500ms); 

                result = _socket.open(_net); 
                if (result != 0) {
                    printf("Error reopening socket: %d\r\n", result);
                    ThisThread::sleep_for(500ms);
                    retryCount++;
                    continue;
                }

                ThisThread::sleep_for(1s);
                retryCount++;
            }
            else {
                printf("Connected successfully.\r\n");
                LD4_ON;
                break;
            }
        }
        if (retryCount == maxRetries) {
            printf("Failed to connect after %d retries.\r\n", maxRetries);
            return;
        }


        arm_fir_instance_f32 S_X, S_Y, S_Z;
        float32_t firStateF32_X[BLOCK_SIZE + NUM_TAPS - 1];
        float32_t firStateF32_Y[BLOCK_SIZE + NUM_TAPS - 1];
        float32_t firStateF32_Z[BLOCK_SIZE + NUM_TAPS - 1];

        float32_t inputF32_X, inputF32_Y, inputF32_Z;
        float32_t outputF32_X, outputF32_Y, outputF32_Z;

        float32_t bufferX[MAX_BUFFER_SIZE]; 
        float32_t bufferY[MAX_BUFFER_SIZE];
        float32_t bufferZ[MAX_BUFFER_SIZE];
        int bufferIndex = 0; 

        // initialize filter
        arm_fir_init_f32(&S_X, NUM_TAPS, (float32_t *)&firCoeffs32[0], &firStateF32_X[0], blockSize);
        arm_fir_init_f32(&S_Y, NUM_TAPS, (float32_t *)&firCoeffs32[0], &firStateF32_Y[0], blockSize);
        arm_fir_init_f32(&S_Z, NUM_TAPS, (float32_t *)&firCoeffs32[0], &firStateF32_Z[0], blockSize);

        char acc_json[100];
        int response = 0;
        int lastLevel = 0;
        double lastDeg = 0;
        int16_t pAccDataXYZ[3] = {0};
        BSP_ACCELERO_Init();

        // heartbeat timer
        Timer heartbeatTimer;
        heartbeatTimer.start();
        const auto heartbeatInterval = 3s;

        // music setup
        const int songspeed = 1.5;
        float result;
        float bzz = 0.5;

        while (1){

            BSP_ACCELERO_AccGetXYZ(pAccDataXYZ);

            // DSP start
            inputF32_X = (float32_t)pAccDataXYZ[0]/1000;
            inputF32_Y = (float32_t)pAccDataXYZ[1]/1000;
            inputF32_Z = (float32_t)pAccDataXYZ[2]/1000;
            arm_fir_f32(&S_X, &inputF32_X, &outputF32_X, 1);
            arm_fir_f32(&S_Y, &inputF32_Y, &outputF32_Y, 1);
            arm_fir_f32(&S_Z, &inputF32_Z, &outputF32_Z, 1);
            // DSP end

            // send first 30 data
            if (bufferIndex < MAX_BUFFER_SIZE) {
                bufferIndex++;
            } else {
                int16_t ax = pAccDataXYZ[0], ay = pAccDataXYZ[1], az = pAccDataXYZ[2];
                double deg = atan2(sqrt(ax * ax + ay * ay), az) * (180.0 / 3.14);
                int len = sprintf(acc_json, "{\"ax\":%d,\"ay\":%d,\"az\":%d}", int(outputF32_X*1000), int(outputF32_Y*1000), int(outputF32_Z*1000));
                auto time_elapsed = heartbeatTimer.elapsed_time(); 
                if (time_elapsed >= heartbeatInterval) {                
                    const char* heartbeatMsg = "{\"type\": \"heartbeat\"}";
                    int sent = _socket.send(heartbeatMsg, strlen(heartbeatMsg));
                    if (sent <= 0) {
                        LD3_ON;
                        printf("Failed to send heartbeat\n");
                    } 
                    heartbeatTimer.reset(); 
                }
                if (lastLevel != button_switch) {
                    const char* levelMsg = (int(button_switch)%2) ? "{\"level\": \"3\"}" : "{\"level\": \"2\"}"; 
                    int sent = _socket.send(levelMsg, strlen(levelMsg));
                    if (sent <= 0) {
                        printf("Failed to send level\n");
                    } 
                    lastLevel = button_switch;
                }

                char recv_buffer[10];

                if (lastDeg > 120 && deg <= 120){
                    response = _socket.send(acc_json, len);
                    if (0 >= response){
                        LD3_ON;
                        printf("Error sending: %d\n", response);

                        _socket.close(); 
                        result = _socket.open(_net); 
                        if (result != 0) {
                            printf("Error reopening socket: %d\r\n", result);
                            ThisThread::sleep_for(1s);
                            continue;
                        }

                        result = _socket.connect(address);
                        if (result != 0) {
                            printf("Error reconnecting: %d\r\n", result);
                            ThisThread::sleep_for(1s);
                            continue;
                        } 
                    } else {
                        LD4_ON;
                        nsapi_size_or_error_t recv_size = _socket.recv(recv_buffer, sizeof(recv_buffer) - 1);
                        if (recv_size > 0) {
                            if (strcmp(recv_buffer, "success") == 0) {
                                // buzzer.period(0.02f);
                                // buzzer.write(0.5f); 
                                // ThisThread::sleep_for(1000ms);
                                // buzzer.write(0.0f); 
                                
                                // play music (new feature)
                                for(int i=0;i<19;i++){
                                    int w = duration[i] * songspeed;
                                    if(notes[i] == 0) {
                                        result = 1;
                                        bzz = 0;
                                    }
                                    else {
                                        result = 1 / notes[i];  
                                        bzz = 0.4;  
                                    }
                                    
                                    if(NOTE_E4 == notes[i])
                                        led_write(1.0,0.0,1.0); 
                                    else
                                        led_write(0.0,0.0,0.0);

                                    buzzer.period(result);
                                    buzzer.write(bzz); 
                                    wait_ms(w);
                                }
                                
                            } else if (strcmp(recv_buffer, "fail") == 0) {
                                for (int i = 0; i < 2; ++i) {
                                    buzzer.period(0.01f);
                                    buzzer.write(0.5f); 
                                    ThisThread::sleep_for(250ms);
                                    buzzer.write(0.0f); 
                                    if (i < 1) {
                                        ThisThread::sleep_for(250ms);
                                    }
                                }
                            }
                        } else {
                            printf("Failed to receive response or connection closed: %d\n", recv_size);
                        }
                    }
                    
                }
                lastDeg = deg;
            }

            ThisThread::sleep_for(100ms); // CHANGE THIS
        }

        printf("Demo concluded successfully \r\n");
    }

private:
    bool resolve_hostname(SocketAddress &address)
    {
        const char hostname[] = MBED_CONF_APP_HOSTNAME;

        /* get the host address */
        printf("\nResolve hostname %s\r\n", hostname);
        nsapi_size_or_error_t result = _net->gethostbyname(hostname, &address);
        if (result != 0) {
            printf("Error! gethostbyname(%s) returned: %d\r\n", hostname, result);
            return false;
        }

        printf("%s address is %s\r\n", hostname, (address.get_ip_address() ? address.get_ip_address() : "None") );

        return true;
    }

    bool send_http_request()
    {
        /* loop until whole request sent */
        const char buffer[] = "GET / HTTP/1.1\r\n"
                              "Host: ifconfig.io\r\n"
                              "Connection: close\r\n"
                              "\r\n";

        nsapi_size_t bytes_to_send = strlen(buffer);
        nsapi_size_or_error_t bytes_sent = 0;

        printf("\r\nSending message: \r\n%s", buffer);

        while (bytes_to_send) {
            bytes_sent = _socket.send(buffer + bytes_sent, bytes_to_send);
            if (bytes_sent < 0) {
                printf("Error! _socket.send() returned: %d\r\n", bytes_sent);
                return false;
            } else {
                printf("sent %d bytes\r\n", bytes_sent);
            }

            bytes_to_send -= bytes_sent;
        }

        printf("Complete message sent\r\n");

        return true;
    }

    bool receive_http_response()
    {
        char buffer[MAX_MESSAGE_RECEIVED_LENGTH];
        int remaining_bytes = MAX_MESSAGE_RECEIVED_LENGTH;
        int received_bytes = 0;

        /* loop until there is nothing received or we've ran out of buffer space */
        nsapi_size_or_error_t result = remaining_bytes;
        while (result > 0 && remaining_bytes > 0) {
            result = _socket.recv(buffer + received_bytes, remaining_bytes);
            if (result < 0) {
                printf("Error! _socket.recv() returned: %d\r\n", result);
                return false;
            }

            received_bytes += result;
            remaining_bytes -= result;
        }

        /* the message is likely larger but we only want the HTTP response code */

        printf("received %d bytes:\r\n%.*s\r\n\r\n", received_bytes, strstr(buffer, "\n") - buffer, buffer);

        return true;
    }

    void wifi_scan()
    {
        WiFiInterface *wifi = _net->wifiInterface();

        WiFiAccessPoint ap[MAX_NUMBER_OF_ACCESS_POINTS];

        /* scan call returns number of access points found */
        int result = wifi->scan(ap, MAX_NUMBER_OF_ACCESS_POINTS);

        if (result <= 0) {
            printf("WiFiInterface::scan() failed with return value: %d\r\n", result);
            return;
        }

        printf("%d networks available:\r\n", result);

        for (int i = 0; i < result; i++) {
            printf("Network: %s secured: %s BSSID: %hhX:%hhX:%hhX:%hhx:%hhx:%hhx RSSI: %hhd Ch: %hhd\r\n",
                   ap[i].get_ssid(), get_security_string(ap[i].get_security()),
                   ap[i].get_bssid()[0], ap[i].get_bssid()[1], ap[i].get_bssid()[2],
                   ap[i].get_bssid()[3], ap[i].get_bssid()[4], ap[i].get_bssid()[5],
                   ap[i].get_rssi(), ap[i].get_channel());
        }
        printf("\r\n");
    }

    void print_network_info()
    {
        /* print the network info */
        SocketAddress a;
        _net->get_ip_address(&a);
        printf("IP address: %s\r\n", a.get_ip_address() ? a.get_ip_address() : "None");
        _net->get_netmask(&a);
        printf("Netmask: %s\r\n", a.get_ip_address() ? a.get_ip_address() : "None");
        _net->get_gateway(&a);
        printf("Gateway: %s\r\n", a.get_ip_address() ? a.get_ip_address() : "None");
    }

private:
    NetworkInterface *_net;

#if MBED_CONF_APP_USE_TLS_SOCKET
    TLSSocket _socket;
#else
    TCPSocket _socket;
#endif // MBED_CONF_APP_USE_TLS_SOCKET
};

int main() {
    printf("\r\nStarting socket demo\r\n\r\n");

#ifdef MBED_CONF_MBED_TRACE_ENABLE
    mbed_trace_init();
#endif

    SocketDemo *example = new SocketDemo();
    MBED_ASSERT(example);
    example->run();

    return 0;
}