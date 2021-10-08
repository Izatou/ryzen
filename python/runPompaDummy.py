import sys

while 1:
    toggle = sys.stdin.read(1)

    if toggle == "1":
        print("Pompa nyala")
    else:
        print("Pompa mati")
    
    sys.stdout.flush()