import sys
import time
from random import randint
import struct

n = 13

while 1:
	data = bytearray()

	for i in range(n):
		if i == 0 :
			angka = randint(150, 155)
		elif i == 1 :
			angka = randint(300, 305)
		elif i == 2 :
			angka = randint(400, 405)
		elif i == 3 :
			angka = randint(500, 505)
		elif i == 4 :
			angka = randint(600, 605)
		elif i == 5 :
			angka = randint(500, 505)
		elif i == 6 :
			angka = randint(300, 305)
		elif i == 7 :
			angka = randint(300, 305)
		elif i == 8 :
			angka = 2
		else:
			angka =  randint(40,45)
		
		# angka = i
		data += bytearray(struct.pack("f", angka))
		# angkaHIGH = angka >> 0xFF
		# angkaLOW = angka & 0xFF
		# data.append(angkaHIGH)
		# data.append(angkaLOW)
	
	# print(data)
	sys.stdout.buffer.write(data)
	sys.stdout.flush()
	time.sleep(1)
	# time.sleep(0.1)