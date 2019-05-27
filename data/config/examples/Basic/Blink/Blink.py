from mpython import *

# 当你按下复位或为电路板供电时，设置函数会运行一次
LED_BUILTIN = 0

p0 = MPythonPin(LED_BUILTIN, PinMode.OUT)       # 初始化数字引脚LED_BUILTIN作为输出。

# 循环函数会一直重复运行

p0.write_digital(1)    # 打开LED（HIGH是电压高电平）
sleep(1)                        # 等待1秒
p0.write_digital(0)     # 关闭LED（LOW是电压低电平）
sleep(1)                        # 等待1秒