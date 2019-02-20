'use strict';
Blockly.Blocks.extensions = Blockly.Blocks.extensions || {};

Blockly.Blocks.extensions.TOUCH_SENSOR_HUE = 210; // 模块颜色 0-360，或者 #abcdef

Blockly.Blocks.extensions.list_touchSensor = function() {
  return Blockly.Blocks.extensions.genComponentOptions("touchSensor", [["触摸传感器", "触摸传感器"]]);
}

Blockly.Msg.ARD_EXT_TOUCH_SENSOR_STATUS_NAME = "触摸传感器";
Blockly.Msg.ARD_EXT_TOUCH_SENSOR_STATUS_STATUS = "状态值";
Blockly.Msg.ARD_EXT_TOUCH_SENSOR_STATUS_TIP = "触摸传感器状态";

Blockly.Blocks.ext_touchSensor_status = {
  init: function() {
    this.setHelpUrl('http://arduino.cc/en/Reference/DigitalRead');
    this.setColour(Blockly.Blocks.extensions.TOUCH_SENSOR_HUE);

    this.appendDummyInput()
        .appendField(Blockly.Msg.ARD_EXT_TOUCH_SENSOR_STATUS_NAME)
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.extensions.list_touchSensor), 'TOUCH_SENSOR')
        .appendField(Blockly.Msg.ARD_EXT_TOUCH_SENSOR_STATUS_STATUS);

    this.setOutput(true, Blockly.Types.BOOLEAN.output);
    this.setTooltip(Blockly.Msg.ARD_EXT_TOUCH_SENSOR_STATUS_TIP);
  },

  getBlockType: function() {
    return Blockly.Types.BOOLEAN;
  },
};

Blockly.Arduino.ext_touchSensor_status = function(block) {
  var touchSensor = block.getFieldValue('TOUCH_SENSOR');

  var config = Blockly.Blocks.extensions.getConfig("touchSensor", touchSensor);
  var pin = config.pin;

  Blockly.Arduino.reservePin(block, pin, Blockly.Arduino.PinTypes.INPUT, 'Digital Read');

  var pinSetupCode = 'pinMode(' + pin + ', INPUT);';
  Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);

  var code = 'digitalRead(' + pin + ')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};
