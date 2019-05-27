from mpython import *
import machine
from machine import *

pingPin = 7

while True:
    # 事先给出一个短的低脉冲，以确保清洁的高脉冲：
    p0 = MPythonPin(pingPin,PinMode.OUT)
    p0.write_digital(0)
    sleep_us(2)
    p0.write_digital(1)
    sleep_us(5)
    p0.write_digital(0)

    duration = machine.time_pulse_us(Pin(pingPin, Pin.IN), 1)

    # 将时间转换为距离
    inches = microsecondsToInches(duration)
    cm = microsecondsToCentimeters(duration)

    print(inches)
    print("in, ")
    print(cm)
    print("cm")
    print("")

    sleep_ms(100)

def microsecondsToInches(microseconds):
    return microseconds / 74 / 2


def microsecondsToCentimeters(microseconds):
    return microseconds / 29 / 2
