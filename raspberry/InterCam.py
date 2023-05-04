# ============================== INTERCAM ==============================
# InterCam is an IoT system designed to check the presence of people 
# wishing to enter a specific environment and allow entry only after 
# approval by the person in charge of the place. To do this, the system 
# uses a presence sensor, a camera, and motors to control the locking and 
# opening of doors.
#
# The system's action process starts when the individual approaches the 
# entrance of the enclosure.  At the moment the device verifies the 
# presence of a person in the room, a signal is sent to the computer 
# informing it to activate the camera and capture the person's image. 
# The computer then monitors the camera image, in real time, until the 
# person's face is identified. At this point, the computer captures the 
# image containing the face of the person who intends to enter the 
# environment and sends it to a server, which is responsible for notifying 
# the owner of the place that there is someone at the entrance or waiting 
# for him/her. The server is also responsible for sending the information 
# received to a web page, which allows the person in charge to accept or 
# reject the entrance of the individual in the environment. Then, given 
# the response of the responsible party, the door will be opened or not.
# 
# For the scope of this course, however, we will not be able to control 
# a real door with the necessary actuators. Therefore, we will use a red 
# and a green LED, which will represent the door being closed or open, 
# respectively.

# ======================================================================
# =                                LIBS                                =
# ======================================================================
import threading
import RPi.GPIO as GPIO
import time
from flask import Flask, request
from communication import ClientCommunication
from hcsr04 import HCSR04

# ======================================================================
# =                             CONSTANTS                              =
# ======================================================================
# The constants below are used to configure the system.
# There are constants for the ultrasonic sensor, LEDs, and buzzer.
#
# ULTRASSONIC SENSOR
GPIO_TRIGGER = 31
GPIO_ECHO = 29
THRESHOLD_CM = 10
SLEEP_DETECT_SECONDS = 13
# LEDs
GREEN_LED = 11
RED_LED = 13
# BUZZER
BUZZER = 15
ALLOWED_FREQUENCY = 440           # Hz
DENIED_FREQUENCY = 1480           # Hz
ALLOWED_SLEEP_DURATION = 1        # seconds
DENIED_SLEEP_DURATION = 0.5       # seconds
# ACTUATORS TIME
ACTUATORS_TIME = 2                # seconds

# ======================================================================
# =                               SETUP                                =
# ======================================================================
# It sets the GPIO mode to BOARD, which means that the pin numbers
# correspond to the pin numbers on the Pi header. It also sets GPIO pins.
GPIO.setmode(GPIO.BOARD)
GPIO.setup(GREEN_LED, GPIO.OUT)
GPIO.setup(RED_LED, GPIO.OUT)
GPIO.setup(BUZZER, GPIO.OUT)


# ======================================================================
# =                              SERVER                                =
# ======================================================================
app = Flask(__name__)

# `answer` is responsible for receiving the response from the FOG and
# handle the respective response, allowing or denying access to the
# person. Then, it is responsible for call the respective action to
# allow or deny the entrance.
@app.route('/answer', methods=['POST'])
def answer():
    data = request.get_json(force=True)
    answer = data['answer']

    handle_access = None
    if answer == True:        
        handle_access = access_allowed
    else:
        handle_access = access_denied
    t = threading.Thread(target=handle_access)
    t.start()

    return { "success": True }


# ======================================================================
# =                              DEVICE                                =
# ======================================================================

# `detect_distance_fsm` is responsible for detecting the presence of
# people in the environment and sending a request to the server to start
# the face recognition process.
# Also, when a person is detected in the environment, the system will
# not detect another person for `SLEEP_DETECT_SECONDS` seconds, to avoid
# sending multiple requests to the server.
def detect_person_fsm():
    # The value which indicates whether there is someone in the door or not.
    has_somebody_in_door = False

    try:
        while True:
            hcsr = HCSR04(GPIO_TRIGGER, GPIO_ECHO)
            client = ClientCommunication()
            distance = hcsr.calculate_distance()
            print(f"DISTANCE {distance} CM.")

            if not has_somebody_in_door:
                print(f"NOBODY IN DOOR.")
                if distance < THRESHOLD_CM:
                    client.send_request()
                    has_somebody_in_door = True
                    # Does not detect another person for 
                    # SLEEP_DETECT_SECONDS seconds.
                    time.sleep(SLEEP_DETECT_SECONDS)
            else:
                print(f"SOMEBODY IN DOOR.")
                if distance > THRESHOLD_CM:
                    has_somebody_in_door = False
                
            time.sleep(0.5)
    except KeyboardInterrupt:
        print("Measurement stopped by User.")
        GPIO.cleanup()

# It plays a beep on BUZZER pin using a PWM.
def beep(frequency, sleep_duration):
    pwm = GPIO.PWM(BUZZER, frequency)
    pwm.start(50)
    time.sleep(sleep_duration)
    pwm.stop()
    time.sleep(sleep_duration)

# It handles the device actuators to allow access to the person. 
def access_allowed():
    start_time = time.time()
    while time.time() - start_time < ACTUATORS_TIME:
        GPIO.output(GREEN_LED, GPIO.HIGH)
        GPIO.output(RED_LED, GPIO.LOW)
        beep(ALLOWED_FREQUENCY, ALLOWED_SLEEP_DURATION)
        
    # Reset the LEDs.
    GPIO.output(GREEN_LED, GPIO.LOW)
    GPIO.output(RED_LED, GPIO.LOW)

# It handles the device actuators to deny access to the person. 
def access_denied():
    start_time = time.time()
    while time.time() - start_time < ACTUATORS_TIME:
        GPIO.output(GREEN_LED, GPIO.LOW)
        GPIO.output(RED_LED, GPIO.HIGH)
        beep(DENIED_FREQUENCY, DENIED_SLEEP_DURATION)

    # Reset the LEDs.
    GPIO.output(GREEN_LED, GPIO.LOW)
    GPIO.output(RED_LED, GPIO.LOW)

# ======================================================================
# =                               MAIN                                 =
# ======================================================================
# `main` is responsible for starting the `detect_person_fsm` thread and
# the Flask server. It is the entrance point of the program.
if __name__ == '__main__':
    t = threading.Thread(target=detect_person_fsm)
    t.start()
    app.run(debug=True, port=80, host='0.0.0.0')