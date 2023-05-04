import RPi.GPIO as GPIO
import time 
class HCSR04():
    def __init__(self, trigger, echo):
        self.trigger = trigger
        self.echo = echo
        GPIO.setup(trigger, GPIO.OUT)
        GPIO.setup(echo, GPIO.IN)

    def calculate_distance(self):
        GPIO.output(self.trigger, True)
        # set Trigger after 0.01ms to LOW
        time.sleep(0.00001)
        GPIO.output(self.trigger, False)

        StartTime = time.time()
        StopTime = time.time()
        while GPIO.input(self.echo) == 0:
            StartTime = time.time()

        while GPIO.input(self.echo) == 1:
            StopTime = time.time()

        TimeElapsed = StopTime - StartTime
        # multiply with the sonic speed (34300 cm/s)
        distance = (TimeElapsed * 34300) / 2

        return distance       
   
    