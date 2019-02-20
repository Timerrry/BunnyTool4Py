'use strict';
Blockly.Blocks.extensions = Blockly.Blocks.extensions || {};

Blockly.Blocks.extensions.RAINDROPSENSOR_HUE = 180; // 模块颜色 0-360，或者 #abcdef

Blockly.Blocks.extensions.list_raindropSensor = function() {
  return Blockly.Blocks.extensions.genComponentOptions("raindropSensor", [["雨滴传感器", "雨滴传感器"]]);
}

Blockly.Msg.ARD_EXT_RAINDROPSENSOR_STATUS_NAME = "雨滴传感器";
Blockly.Msg.ARD_EXT_RAINDROPSENSOR_VALUE_VALUE = "数值";
Blockly.Msg.ARD_EXT_RAINDROPSENSOR_VALUE_TIP = "雨滴传感器状态";

Blockly.Blocks.ext_raindropSensor_value = {
  init: function() {
    this.setHelpUrl('http://arduino.cc/en/Reference/AnalogRead');
    this.setColour(Blockly.Blocks.extensions.RAINDROPSENSOR_HUE);

    this.appendDummyInput()
        .appendField(Blockly.Msg.ARD_EXT_RAINDROPSENSOR_STATUS_NAME)
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.extensions.list_raindropSensor), 'RAINDROPSENSOR')
        .appendField(Blockly.Msg.ARD_EXT_RAINDROPSENSOR_VALUE_VALUE);

    this.setOutput(true, Blockly.Types.NUMBER.output);
    this.setTooltip(Blockly.Msg.ARD_EXT_RAINDROPSENSOR_VALUE_TIP);
  },

  getBlockType: function() {
    return Blockly.Types.NUMBER;
  },
};

Blockly.Arduino.ext_raindropSensor_value = function(block) {
  var raindropSensor = block.getFieldValue('RAINDROPSENSOR');

  var config = Blockly.Blocks.extensions.getConfig("raindropSensor", raindropSensor);
  var pin = config.pin;

  Blockly.Arduino.reservePin(block, pin, Blockly.Arduino.PinTypes.INPUT, 'Analog Read');

  var pinSetupCode = 'pinMode(' + pin + ', INPUT);';
  Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);

  var code = 'analogRead(' + pin + ')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};
