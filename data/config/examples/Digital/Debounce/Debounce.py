from mpython import *

HIGH = 1  # 高电平
LOW = 0  # 低电平

buttonPin = 2    # 设置按钮引脚号
ledPin = 13      # 设置LED引脚号

ledState = HIGH         # 输出引脚的当前状态
buttonState = 0            # 输入引脚的电流读数
lastButtonState = LOW   # 输入引脚的先前读数

lastDebounceTime = 0  # 最后一次切换输出引脚
debounceDelay = 50    # 去抖，如果输出闪烁则增加此变量

pBtn = MPythonPin(buttonPin, PinMode.IN)
pLed = MPythonPin(ledPin, PinMode.OUT)

# 设置初始LED状态
pLed.write_digital(ledState)

while True:
    # 将切换状态读入局部变量
    reading = pBtn.read_digital()
    # 检查你是否只按了按钮
    #（即输入从低到高），你已经等了足够长的时间
    # 自上次按下以忽略任何噪音：
    
    # 如果开关由于噪音或按压而改变：
    if reading != lastButtonState:
        # 重置去抖动计时器
        lastDebounceTime = time.ticks_cpu()
    
    if (time.ticks_cpu() - lastDebounceTime) > debounceDelay:
    # 无论阅读是什么，它存在的时间都长于去抖
    # 延迟，所以把它当作实际的当前状态：

        # 如果按钮状态已更改：
        if reading != buttonState:
            buttonState = reading

        # 如果新按钮状态为HIGH，则仅切换LED
        if (buttonState == HIGH):
            ledState = int(not ledState)
    
    # 设置LED：
    pLed.write_digital(ledState)

    # 保存阅读。 下次循环时，它将是lastButtonState：
    lastButtonState = reading