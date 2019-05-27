from mpython import *                            # 导入mpython所有对象


firstSensor = 0    # 第一个模拟传感器
secondSensor = 0   # 第二个模拟传感器
thirdSensor = 0    # 第三个模拟传感器

uart=UART(1,baudrate=9600,tx=Pin.P15,rx=Pin.P16) # 构建UART对象，设置波特率为9600，TX、RX 引脚分别为P15、P16

def establishContact():
    h = uart.readline()
    while uart.any() <= 0:
        uart.write('A')   # 发送大写字母A
        sleep_ms(300)

establishContact()
while True:
    # 得到传入的数据
    inByte = uart.read()
    # 读取第一个模拟量输入，除以4使范围为0-255
    firstSensor = MPythonPin(0, PinMode.ANALOG).read_analog() / 4
    # 延迟10ms
    sleep_ms(10)
    # 读取第二个模拟输入，除以4使范围为0-255
    secondSensor = MPythonPin(1, PinMode.ANALOG).read_analog() / 4
    # 读取第三个模拟输入，除以4使范围为0-255
    secondSensor = MPythonPin(2, PinMode.ANALOG).read_analog() / 4
    # 发送传感器值
    uart.write(str(firstSensor))
    uart.write(str(secondSensor))
    uart.write(str(thirdSensor))