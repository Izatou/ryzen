import smbus
import struct
import sys
import time

bus = smbus.SMBus(1)

try:
    while(1):
        data = bytearray()
        
        data += bytearray(bus.read_i2c_block_data(0x62, 0x00, 22))
        data += bytearray(bus.read_i2c_block_data(0x62, 0x01, 22))
        
        sys.stdout.buffer.write(data)
        sys.stdout.flush()
        time.sleep(1)
except KeyboardInterrupt:
    sys.exit(0)

