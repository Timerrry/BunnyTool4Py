'use strict';
Blockly.Blocks.extensions = Blockly.Blocks.extensions || {};

Blockly.Blocks.extensions.JOYSTICK_SENSOR_HUE = 210; // 模块颜色 0-360，或者 #abcdef

Blockly.Blocks.extensions.list_joyStick = function() {
  return Blockly.Blocks.extensions.genComponentOptions("joyStick", [["摇杆模块", "摇杆模块"]]);
}

Blockly.Msg.ARD_EXT_JOYSTICK_SENSOR_NAME = "摇杆模块";
Blockly.Msg.ARD_EXT_JOYSTICK_SENSOR_X = "X轴数值";
Blockly.Msg.ARD_EXT_JOYSTICK_SENSOR_Y = "Y轴数值";
Blockly.Msg.ARD_EXT_JOYSTICK_SENSOR_B = "按钮状态";

Blockly.Blocks.ext_joyStick_status = {
  init: function() {
    this.setHelpUrl('http://arduino.cc/en/Reference/DigitalRead');
    this.setColour(Blockly.Blocks.extensions.JOYSTICK_SENSOR_HUE);

    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.extensions.list_joyStick), 'JOYSTICK_SENSOR')
        .appendField(Blockly.Msg.ARD_EXT_JOYSTICK_SENSOR_B);

    this.setOutput(true, Blockly.Types.BOOLEAN.output);
    this.setTooltip(Blockly.Msg.ARD_EXT_JOYSTICK_SENSOR_STATUS_TIP);
  },

  getBlockType: function() {
    return Blockly.Types.BOOLEAN;
  },
};

Blockly.Arduino.ext_joyStick_status = function(block) {
  var joyStick = block.getFieldValue('JOYSTICK_SENSOR');

  var config = Blockly.Blocks.extensions.getConfig("joyStick", joyStick);
  var pin = config.b_pin;

  Blockly.Arduino.reservePin(block, pin, Blockly.Arduino.PinTypes.INPUT, 'Digital Read');

  var pinSetupCode = 'pinMode(' + pin + ', INPUT);';
  Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);

  var code = 'digitalRead(' + pin + ')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Blocks.ext_joyStick_x_value = {
  init: function() {
    this.setHelpUrl('http://arduino.cc/en/Reference/AnalogRead');
    this.setColour(Blockly.Blocks.extensions.JOYSTICK_SENSOR_HUE);

    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.extensions.list_joyStick), 'JOYSTICK_SENSOR')
        .appendField(Blockly.Msg.ARD_EXT_JOYSTICK_SENSOR_X);

    this.setOutput(true, Blockly.Types.NUMBER.output);
    this.setTooltip(Blockly.Msg.ARD_EXT_JOYSTICK_SENSOR_VALUE_TIP);
  },

  getBlockType: function() {
    return Blockly.Types.NUMBER;
  },
};

Blockly.Arduino.ext_joyStick_x_value = function(block) {
  var joyStick = block.getFieldValue('JOYSTICK_SENSOR');

  var config = Blockly.Blocks.extensions.getConfig("joyStick", joyStick);
  var pin = config.x_pin;

  Blockly.Arduino.reservePin(block, pin, Blockly.Arduino.PinTypes.INPUT, 'Analog Read');

  var pinSetupCode = 'pinMode(' + pin + ', INPUT);';
  Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);

  var code = 'analogRead(' + pin + ')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Blocks.ext_joyStick_y_value = {
  init: function() {
    this.setHelpUrl('http://arduino.cc/en/Reference/AnalogRead');
    this.setColour(Blockly.Blocks.extensions.JOYSTICK_SENSOR_HUE);

    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.extensions.list_joyStick), 'JOYSTICK_SENSOR')
        .appendField(Blockly.Msg.ARD_EXT_JOYSTICK_SENSOR_Y);

    this.setOutput(true, Blockly.Types.NUMBER.output);
    this.setTooltip(Blockly.Msg.ARD_EXT_JOYSTICK_SENSOR_VALUE_TIP);
  },

  getBlockType: function() {
    return Blockly.Types.NUMBER;
  },
};

Blockly.Arduino.ext_joyStick_y_value = function(block) {
  var joyStick = block.getFieldValue('JOYSTICK_SENSOR');

  var config = Blockly.Blocks.extensions.getConfig("joyStick", joyStick);
  var pin = config.y_pin;

  Blockly.Arduino.reservePin(block, pin, Blockly.Arduino.PinTypes.INPUT, 'Analog Read');

  var pinSetupCode = 'pinMode(' + pin + ', INPUT);';
  Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);

  var code = 'analogRead(' + pin + ')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};