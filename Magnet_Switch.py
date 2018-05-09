import RPi.GPIO as GPIO
import time
from datetime import datetime

input_pin = 3
On = True
count = 0
be = 0

GPIO.setmode(GPIO.BCM)
GPIO.setup(input_pin, GPIO.IN)

while 1:
	gp = GPIO.input(input_pin)

	if gp == GPIO.HIGH:
		print("OFF")
		be = GPIO.LOW
	elif(be == GPIO.LOW and gp == GPIO.LOW):
		count = count + 1
		date = datetime.now().strftime("%Y/%m/%d %H:%M:%S")	
		be = GPIO.HIGH
		print("ON")
		print(date)
		print(count)

#	if(be == GPIO.LOW and GPIO.input(input_pin) == GPIO.LOW):
#		count = count + 1
#		be = GPIO.HIGH
	
	time.sleep(.1)

