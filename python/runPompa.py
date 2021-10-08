from gpiozero import LED
from signal import pause 
import sys

pompa = LED(24)

pompa.on() # memastikan pompa off
print("pompa.on()")

while 1:
    toggle = sys.stdin.read(1)
    print(toggle)

    if toggle == "1":
        print("Pompa nyala")
        pompa.on()
    else:
        print("Pompa mati")
        pompa.off()
    
    sys.stdout.flush()