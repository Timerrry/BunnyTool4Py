/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Implements the required data for functions for selecting
 *     amongst different Arduino boards.
 */
'use strict';

goog.provide('Blockly.Arduino.Boards');

goog.require('Blockly.Arduino');


/** Object to contain all Arduino board profiles. */
Blockly.Arduino.Boards.profiles = new Object();

/** Arduino Uno board profile. */
Blockly.Arduino.Boards.profiles.uno = {
  name: 'Arduino Uno',
  description: 'Arduino Uno standard compatible board',
  compilerFlag: 'arduino:avr:uno',
  analogPins: [
    ["A0", "A0"],
    ["A1", "A1"],
    ["A2", "A2"],
    ["A3", "A3"],
    ["A4", "A4"],
    ["A5", "A5"],
  ],
  digitalPins: [
    ["0", "0"],
    ["1", "1"],
    ["2", "2"],
    ["3~", "3"],
    ["4", "4"],
    ["5~", "5"],
    ["6~", "6"],
    ["7", "7"],
    ["8", "8"],
    ["9", "9"],
    ["10~", "10"],
    ["11~", "11"],
    ["12", "12"],
    ["13", "13"],
  ],
  pwmPins: [
    ["A0", "A0"],
    ["A1", "A1"],
    ["A2", "A2"],
    ["A3", "A3"],
    ["A4", "A4"],
    ["A5", "A5"],
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
    ['SPI', 'SPI'],
  ],
  spiPins: {
    SPI: [
      ['MOSI', '11'],
      ['MISO', '12'],
      ['SCK', '13'],
    ],
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
    ['I2C', 'Wire'],
  ],
  i2cPins: {
    Wire: [
      ['SDA', 'A4'],
      ['SCL', 'A5'],
    ],
  },
  i2cSpeed: [
    ['100kHz', '100000L'],
    ['400kHz', '400000L'],
  ],
  builtinLed: [
    ['BUILTIN_1', '13'],
  ],
  interrupt: [
    ['interrupt0', '2'],
    ['interrupt1', '3'],
  ],
};

/** Set default profile to Arduino standard-compatible board */
Blockly.Arduino.Boards.selected = Blockly.Arduino.Boards.profiles.uno;

/**
 * Changes the Arduino board profile selected, which trigger a refresh of the
 * blocks that use the profile.
 * @param {Blockly.Workspace} workspace Workspace to trigger the board change.
 * @param {string} newBoard Name of the new profile to set.
 */
Blockly.Arduino.Boards.changeBoard = function(workspace, newBoard) {
  if (Blockly.Arduino.Boards.profiles[newBoard] === undefined) {
    console.log('Tried to set non-existing Arduino board: ' + newBoard);
    return;
  }
  Blockly.Arduino.Boards.selected = Blockly.Arduino.Boards.profiles[newBoard];
  // Update the pin out of all the blocks that uses them
  var blocks = workspace.getAllBlocks();
  for (var i = 0; i < blocks.length; i++) {
    var updateFields = blocks[i].updateFields;
    if (updateFields) {
      updateFields.call(blocks[i]);
    }
  }
};

/**
 * Refreshes the contents of a block Field Dropdown.
 * This is use to refresh the blocks after the board profile has been changed.
 * @param {!Blockly.Block} block Generated code.
 * @param {!string} fieldName Name of the block FieldDropdown to refresh.
 * @param {!string} boardKey Name of the board profile property to fetch.
 */
Blockly.Arduino.Boards.refreshBlockFieldDropdown =
    function(block, fieldName, boardKey) {
  var field = block.getField(fieldName);
  var fieldValue = field.getValue();
  var dataArray = Blockly.Arduino.Boards.selected[boardKey];
  field.menuGenerator_ = dataArray;

  var currentValuePresent = false;
  for (var i = 0; i < dataArray.length; i++) {
    if (fieldValue == dataArray[i][1]) {
      currentValuePresent = true;
    }
  }
  // If the old value is not present any more, add a warning to the block.
  if (!currentValuePresent) {
    block.setWarningText(
        'The old pin value ' + fieldValue + ' is no longer available.', 'bPin');
  } else {
    block.setWarningText(null, 'bPin');
  }
};
