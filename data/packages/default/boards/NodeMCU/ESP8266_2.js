Blockly.Arduino.Boards.profiles.esp8266_huzzah = {
  name: 'Adafruit Feather HUZZAH',
  description: 'Adafruit HUZZAH ESP8266 compatible board',
  compilerFlag: 'esp8266:esp8266:generic',
  analogPins: [
    ['A0', 'A0']
  ],
  digitalPins: [
    ['0', '0'],
    ['2', '2'],
    ['4', '4'],
    ['5', '5'],
    ['12', '12'],
    ['13', '13'],
    ['14', '14'],
    ['15', '15'],
    ['16', '16']
  ],
  pwmPins: [
    ['2', '2']
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
      ['MOSI', '13'],
      ['MISO', '12'],
      ['SCK', '14']
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
      ['SDA', '4'],
      ['SCL', '5']
    ]
  },
  i2cSpeed: [
    ['100kHz', '100000L'],
    ['400kHz', '400000L'],
  ],
  builtinLed: [
    ['BUILTIN_1', '0']
  ],
  interrupt: [
    ['interrupt0', '2'],
    ['interrupt1', '3']
  ]
};
