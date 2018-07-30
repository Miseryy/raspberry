#!/usr/bin/env python
import time
import os
import RPi.GPIO as GPIO
import math

GPIO.setmode(GPIO.BCM)
DEBUG = 1

# read SPI data from MCP3008 chip, 8 possible adc's (0 thru 7)
def readadc(adcnum, clockpin, mosipin, misopin, cspin):
    if ((adcnum > 7) or (adcnum < 0)):
        return -1
    GPIO.output(cspin, True)

    GPIO.output(clockpin, False)  # start clock low
    GPIO.output(cspin, False)     # bring CS low

    commandout = adcnum
    commandout |= 0x18  # start bit + single-ended bit
    commandout <<= 3    # we only need to send 5 bits here
    for i in range(5):
        if (commandout & 0x80):
            GPIO.output(mosipin, True)
        else:
            GPIO.output(mosipin, False)
        commandout <<= 1
        GPIO.output(clockpin, True)
        GPIO.output(clockpin, False)

    GPIO.output(clockpin, True)
    GPIO.output(clockpin, False)
    GPIO.output(clockpin, True)
    GPIO.output(clockpin, False)

    adcout = 0
# read in one empty bit, one null bit and 10 ADC bits
    for i in range(12):
        GPIO.output(clockpin, True)
        GPIO.output(clockpin, False)
        adcout <<= 1
        if (GPIO.input(misopin)):
            adcout |= 0x1

    GPIO.output(cspin, True)

    adcout >>= 1       # first bit is 'null' so drop it
    #print(adcout)
    return adcout


# change these as desired - they're the pins connected from the
# SPI port on the ADC to the Cobbler
#SPICLK = 18
#SPIMISO = 23
#SPIMOSI = 24
#SPICS = 25
# Above pin number seems not working. I modified the pin as below.
# See also: http://elinux.org/RPi_Low-level_peripherals
SPICLK = 11
SPIMISO = 9
SPIMOSI = 10
SPICS = 8

# set up the SPI interface pins
GPIO.setup(SPIMOSI, GPIO.OUT)
GPIO.setup(SPIMISO, GPIO.IN)
GPIO.setup(SPICLK, GPIO.OUT)
GPIO.setup(SPICS, GPIO.OUT)


ave=300
try:
    while 1:
        vall=0
        for i in range(ave):
            val = readadc(0, SPICLK, SPIMOSI, SPIMISO, SPICS)
            if val==0:
                continue

            vall += val**2

        vall = (1/ave) * vall
        vall = math.sqrt(vall)
        voltage = vall * 3.3 / 1024
        current = (voltage - 3.3)
        result = current
        #result /= average
        #print("val: " + str(val))
        print("\n")
        print("\n")
       # print("value: " + str(round(vall, 1)))
       # print("current:"+ str(round(vall*0.00326/0.1485, 2)))
       # print("volume:"+ str(round(vall/10.24, 1)))
        #print("currnetVol: " + str(abs(round(result, 2))))
        print("voltage: " + str(round(voltage*100, 2)))
        #print("CT: " + str(val))
        #data=[{'d1':float(vall), 'd2':float(result)}]
        #am.send(data)
        time.sleep(1)

except KeyboardInterrupt:
    GPIO.cleanup()
    pass


    #print((val/4094.0) * 3.3 * 100)

