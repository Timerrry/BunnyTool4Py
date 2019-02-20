Blockly.Arduino.Boards.profiles.esp8266_wemos_d1 = {
  name: 'Wemos D1',
  description: 'Wemos D1 R2 compatible board',
  compilerFlag: 'esp8266:esp8266:generic',
  analogPins: [
    ['A0', 'A0']
  ],
  digitalPins: [
    ['D0', 'D0'],
    ['D1', 'D1'],
    ['D2', 'D2'],
    ['D3', 'D3'],
    ['D4', 'D4'],
    ['D5', 'D5'],
    ['D6', 'D7'],
    ['D8', 'D8']
  ],
  pwmPins: [
    ['D1', 'D1'],
    ['D2', 'D2'],
    ['D3', 'D3'],
    ['D4', 'D4'],
    ['D5', 'D5'],
    ['D6', 'D7'],
    ['D8', 'D8']
  ],
  serial: [
    ['serial', 'Serial']
  ],
  serialPins: {
    Serial: [
      ['RX', 'RX'],
      ['TX', 'TX']
    ]
  },
  serialSpeed: [
    ['300', '300'],
    ['600', '600'],
    ['1200', '1200'],
    ['2400', '2400'],
    ['4800', '4800'],
    ['9600', '9600'],
    ['14400', '14400'],
    ['19200', '19200'],
    ['28800', '28800'],
    ['31250', '31250'],
    ['38400', '38400'],
    ['57600', '57600'],
    ['115200', '115200'],
  ],
  spi: [
    ['SPI', 'SPI']
  ],
  spiPins: {
    SPI: [
      ['MOSI', 'D7'],
      ['MISO', 'D6'],
      ['SCK', 'D5']
    ]
  },
  spiClockDivide: [
    ['2 (8MHz)', 'SPI_CLOCK_DIV2'],
    ['4 (4MHz)', 'SPI_CLOCK_DIV4'],
    ['8 (2MHz)', 'SPI_CLOCK_DIV8'],
    ['16 (1MHz)', 'SPI_CLOCK_DIV16'],
    ['32 (500KHz)', 'SPI_CLOCK_DIV32'],
    ['64 (250KHz)', 'SPI_CLOCK_DIV64'],
    ['128 (125KHz)', 'SPI_CLOCK_DIV128'],
  ],
  i2c: [
    ['I2C', 'Wire']
  ],
  i2cPins: {
    Wire: [
      ['SDA', 'D2'],
      ['SCL', 'D1']
    ]
  },
  i2cSpeed: [
    ['100kHz', '100000L'],
    ['400kHz', '400000L'],
  ],
  builtinLed: [
    ['BUILTIN_1', 'D4']
  ],
  interrupt: [
    ['D0', 'D0'],
    ['D1', 'D1'],
    ['D2', 'D2'],
    ['D3', 'D3'],
    ['D4', 'D4'],
    ['D5', 'D5'],
    ['D6', 'D7'],
    ['D8', 'D8']
  ]
};
