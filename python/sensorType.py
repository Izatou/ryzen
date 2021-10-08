import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BCM)
GPIO.setup(21, GPIO.IN, pull_up_down = GPIO.PUD_UP)
print("1" if GPIO.input(21) else "2") # sensor lama 1, sensor baru 2