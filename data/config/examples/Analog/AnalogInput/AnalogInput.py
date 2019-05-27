from mpython import *           # 导入mpython模块

ledPin = 0                        # 设置LED的引脚
sensorPin = 1                    # 设置电位器的输入引脚
sensorValue = 0                    # 定义一个变量，用来存储来自传感器的值


pLed = MPythonPin(ledPin, PinMode.OUT)           # 将LED引脚设为输出
pSen = MPythonPin(sensorPin, PinMode.ANALOG)  # 将电位器设为模拟输入模式

sensorValue = pSen.read_analog()  # 从传感器读取值
pLed.write_digital(1)           # 点亮LED
sleep_ms(sensorValue)
pLed.write_digital(0)            # 熄灭LED
sleep_ms(sensorValue)