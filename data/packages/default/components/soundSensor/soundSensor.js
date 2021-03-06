'use strict';
Blockly.Blocks.extensions = Blockly.Blocks.extensions || {};

Blockly.Blocks.extensions.SOUND_SENSOR_HUE = 210; // 模块颜色 0-360，或者 #abcdef

Blockly.Blocks.extensions.list_soundSensor = function() {
  return Blockly.Blocks.extensions.genComponentOptions("soundSensor", [["声音传感器", "声音传感器"]]);
}

Blockly.Msg.ARD_EXT_SOUND_SENSOR_STATUS_NAME = "声音传感器";
Blockly.Msg.ARD_EXT_SOUND_SENSOR_STATUS_STATUS = "状态值";
Blockly.Msg.ARD_EXT_SOUND_SENSOR_STATUS_TIP = "声音传感器状态";

Blockly.Blocks.ext_soundSensor_status = {
  init: function() {
    this.setHelpUrl('http://arduino.cc/en/Reference/DigitalRead');
    this.setColour(Blockly.Blocks.extensions.SOUND_SENSOR_HUE);

    this.appendDummyInput()
        .appendField(Blockly.Msg.ARD_EXT_SOUND_SENSOR_STATUS_NAME)
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.extensions.list_soundSensor), 'SOUND_SENSOR')
        .appendField(Blockly.Msg.ARD_EXT_SOUND_SENSOR_STATUS_STATUS);

    this.setOutput(true, Blockly.Types.BOOLEAN.output);
    this.setTooltip(Blockly.Msg.ARD_EXT_SOUND_SENSOR_STATUS_TIP);
  },

  getBlockType: function() {
    return Blockly.Types.BOOLEAN;
  },
};

Blockly.Arduino.ext_soundSensor_status = function(block) {
  var soundSensor = block.getFieldValue('SOUND_SENSOR');

  var config = Blockly.Blocks.extensions.getConfig("soundSensor", soundSensor);
  var pin = config.pin;

  Blockly.Arduino.reservePin(block, pin, Blockly.Arduino.PinTypes.INPUT, 'Digital Read');

  var pinSetupCode = 'pinMode(' + pin + ', INPUT);';
  Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);

  var code = 'digitalRead(' + pin + ')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};


Blockly.Msg.ARD_EXT_SOUND_SENSOR_VALUE_VALUE = "数值";
Blockly.Msg.ARD_EXT_SOUND_SENSOR_VALUE_TIP = "声音传感器数值";

Blockly.Blocks.ext_soundSensor_value = {
  init: function() {
    this.setHelpUrl('http://arduino.cc/en/Reference/AnalogRead');
    this.setColour(Blockly.Blocks.extensions.SOUND_SENSOR_HUE);

    this.appendDummyInput()
        .appendField(Blockly.Msg.ARD_EXT_SOUND_SENSOR_STATUS_NAME)
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.extensions.list_soundSensor), 'SOUND_SENSOR')
        .appendField(Blockly.Msg.ARD_EXT_SOUND_SENSOR_VALUE_VALUE);

    this.setOutput(true, Blockly.Types.NUMBER.output);
    this.setTooltip(Blockly.Msg.ARD_EXT_SOUND_SENSOR_VALUE_TIP);
  },

  getBlockType: function() {
    return Blockly.Types.NUMBER;
  },
};

Blockly.Arduino.ext_soundSensor_value = function(block) {
  var soundSensor = block.getFieldValue('SOUND_SENSOR');

  var config = Blockly.Blocks.extensions.getConfig("soundSensor", soundSensor);
  var pin = config.pin;

  Blockly.Arduino.reservePin(block, pin, Blockly.Arduino.PinTypes.INPUT, 'Analog Read');

  var pinSetupCode = 'pinMode(' + pin + ', INPUT);';
  Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);

  var code = 'analogRead(' + pin + ')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};
