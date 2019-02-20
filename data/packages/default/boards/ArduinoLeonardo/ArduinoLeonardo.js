Blockly.Arduino.Boards.profiles.leonardo = {
  name: 'Arduino Leonardo',
  description: 'Arduino Leonardo-compatible board',
  compilerFlag: 'arduino:avr:leonardo',
  analogPins: [
    ["A0", "A0"],
    ["A1", "A1"],
    ["A2", "A2"],
    ["A3", "A3"],
    ["A4", "A4"],
    ["A5", "A5"],
    ["A6", "4"],
    ["A7", "6"],
    ["A8", "8"],
    ["A9", "9"],
    ["A10", "10"],
    ["A11", "12"]
  ],
  digitalPins: [
    ["0", "0"],
    ["1", "1"],
    ["2", "2"],
    ["3", "3"],
    ["4", "4"],
    ["5", "5"],
    ["6", "6"],
    ["7", "7"],
    ["8", "8"],
    ["9", "9"],
    ["10", "10"],
    ["11", "11"],
    ["12", "12"],
    ["13", "13"],
    ["A0", "A0"],
    ["A1", "A1"],
    ["A2", "A2"],
    ["A3", "A3"],
    ["A4", "A4"],
    ["A5", "A5"]
  ],
  pwmPins: [
    ["3", "3"],
    ["5", "5"],
    ["6", "6"],
    ["9", "9"],
    ["10", "10"],
    ["11", "11"],
    ["13", "13"]
  ],
  serial: [
    ['serial', 'Serial'],
  ],
  serialPins: {
    Serial: [
      ['RX', '0'],
      ['TX', '1'],
    ],
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
      ['MOSI', 'ICSP-4'],
      ['MISO', 'ICSP-1'],
      ['SCK', 'ICSP-3']
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
      ['SDA', '2'],
      ['SCL', '3']
    ]
  },
  i2cSpeed: [
    ['100kHz', '100000L'],
    ['400kHz', '400000L'],
  ],
  builtinLed: [
    ['BUILTIN_1', '13'],
  ],
  interrupt: [
    ['interrupt0', '3'],
    ['interrupt1', '2'],
    ['interrupt2', '0'],
    ['interrupt3', '1'],
    ['interrupt4', '17']
  ]
};
