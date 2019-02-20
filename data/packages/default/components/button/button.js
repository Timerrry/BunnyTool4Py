'use strict';
Blockly.Blocks.extensions = Blockly.Blocks.extensions || {};

Blockly.Blocks.extensions.BUTTON_HUE = 210; // 模块颜色 0-360，或者 #abcdef

Blockly.Blocks.extensions.list_button = function() {
  return Blockly.Blocks.extensions.genComponentOptions("button", [["按键开关", "按键开关"]]);
}

Blockly.Msg.ARD_EXT_BUTTON_PRESSED = "被按下";
Blockly.Msg.ARD_EXT_BUTTON_PRESSED_TIP = "按键开关是否被按下";

Blockly.Blocks.ext_button_pressed = {
  init: function() {
    this.setHelpUrl('http://arduino.cc/en/Reference/DigitalRead');
    this.setColour(Blockly.Blocks.extensions.BUTTON_HUE);

    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.extensions.list_button), 'BUTTON')
        .appendField(Blockly.Msg.ARD_EXT_BUTTON_PRESSED);

    this.setOutput(true, Blockly.Types.BOOLEAN.output);
    this.setTooltip(Blockly.Msg.ARD_EXT_BUTTON_PRESSED_TIP);
  },

  getBlockType: function() {
    return Blockly.Types.BOOLEAN;
  },
};

Blockly.Arduino.ext_button_pressed = function(block) {
  var button = block.getFieldValue('BUTTON');

  var config = Blockly.Blocks.extensions.getConfig("button", button);
  var pin = config.pin;
  var triggerMode = config.triggerMode;

  Blockly.Arduino.reservePin(block, pin, Blockly.Arduino.PinTypes.INPUT, 'Digital Read');

  var pinSetupCode = 'pinMode(' + pin + ', INPUT);';
  Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);

  var code = 'digitalRead(' + pin + ')';
  code = triggerMode === "HIGH" ? code : '!' + code;
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};
