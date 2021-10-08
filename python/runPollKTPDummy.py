import time
import json
import sys

while 1:
    time.sleep(10)
    data = {}
    data['serial'] = 'asdasjady6328deabad'
    data['ktp'] = '3515142107990005'
    
    print(json.dumps(data))
    sys.stdout.flush()
