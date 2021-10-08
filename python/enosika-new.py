import time
import ADS1256
import sys
import smbus
import struct
import RPi.GPIO as GPIO
from gpiozero import LED

pompa = LED(24)
pompa.on() # memastikan pompa off
print("pompa.on()")

ADC = ADS1256.ADS1256()
ADC.ADS1256_init()

while (1):
    # Get I2C bus
    bus = smbus.SMBus(1)
    # SHT31 address, 0x44(68)
    bus.write_i2c_block_data(0x44, 0x2C, [0x06])  # b669fbc0
    # print(bus)
    time.sleep(0.5)
    # SHT31 address, 0x44(68)
    # Read data back from 0x00(00), 6 bytes
    # Temp MSB, Temp LSB, Temp CRC, Humididty MSB, Humidity LSB, Humidity CRC
    data = bus.read_i2c_block_data(0x44, 0x00, 6)
    # Convert the data
    temp = data[0] * 256 + data[1]
    # print(temp)
    x = -45 + (175 * temp / 65535.0)
    fTemp = -49 + (315 * temp / 65535.0)
    y = 100 * (data[3] * 256 + data[4]) / 65535.0
    #
    cTemp = float("{:.3f}".format(x))
    humidity = float("{:.3f}".format(y))
    #
    ADC_Value = ADC.ADS1256_GetAll()
    #
    data = bytearray()
    # ch0 MQ2
    data += bytearray(struct.pack("f", int(ADC_Value[0]*1023/0x7fffff)))
    # ch1 MQ3
    data += bytearray(struct.pack("f", int(ADC_Value[1]*1023/0x7fffff)))
    # ch2 MQ4
    data += bytearray(struct.pack("f", int(ADC_Value[2]*1023/0x7fffff)))
    # ch3 TGS 2610
    data += bytearray(struct.pack("f", int(ADC_Value[3]*1023/0x7fffff)))
    # ch4 TGS 2600
    data += bytearray(struct.pack("f", int(ADC_Value[4]*1023/0x7fffff)))
    # ch5 TGS 822
    data += bytearray(struct.pack("f", int(ADC_Value[5]*1023/0x7fffff)))
    # ch6 MQ 137
    data += bytearray(struct.pack("f", int(ADC_Value[6]*1023/0x7fffff)))
    # ch7 MQ 138
    data += bytearray(struct.pack("f", int(ADC_Value[7]*1023/0x7fffff)))
    # ch8 MQ 135 (N/A)
    data += bytearray(struct.pack("f", 0))
    # ch9 Temp
    data += bytearray(struct.pack("f", cTemp))
    # ch10 Humidity
    data += bytearray(struct.pack("f", humidity))
    #
    sys.stdout.buffer.write(data)
    sys.stdout.flush()
    time.sleep(0.5)