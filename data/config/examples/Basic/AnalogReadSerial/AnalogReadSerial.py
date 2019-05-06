from mpython import *           # 导入mpython模块

p0 = MPythonPin(0, PinMode.ANALOG)     # 实例化MPythonPin,将P0设置为"PinMode.ANALOG"模式
while True:
    value = p0.read_analog()          # 读取P0引脚模拟量
    oled.DispChar("analog:%d" %value,30,20)  # 通过屏幕打印读取到得值
    oled.show()
    oled.fill(0)