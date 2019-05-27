from mpython import *

txtMsg = "" # 传入文本的字符串
lastStringLength = len(txtMsg) # 上一个字符串的长度

uart = UART(1,baudrate=9600,tx=Pin.P15,rx=Pin.P16) # 构建UART对象，设置波特率为9600，TX、RX 引脚分别为P15、P16
print("\n\nString  length():") # 串口打印

while True:
  # 将传入的字符添加到字符串
  while uart.any() > 0:
    inChar = uart.read()
    txtMsg += inChar

  # 如果发生变化，将其在串口中打印出来
  if len(txtMsg) != lastStringLength:
        print(txtMsg)
        print(len(txtMsg))
        # 如果String超过140个字符，进行提示
        if len(txtMsg) < 140:
            print("That's a perfectly acceptable text message")
        else:
            print("That's too long for a text message.")
            # 下一次循环的长度
            lastStringLength = len(txtMsg)