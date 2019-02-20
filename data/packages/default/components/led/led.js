'use strict';
Blockly.Blocks.extensions = Blockly.Blocks.extensions || {};

Blockly.Blocks.extensions.LED_HUE = 210; // 模块颜色 0-360，或者 #abcdef

Blockly.Blocks.extensions.list_led = function() {
  return Blockly.Blocks.extensions.genComponentOptions("led", [["LED", "LED"]]);
}

Blockly.Msg.ARD_EXT_LED_TURN = "LED";
Blockly.Msg.ARD_EXT_LED_TURN_ON = "点亮";
Blockly.Msg.ARD_EXT_LED_TURN_OFF = "熄灭";
Blockly.Msg.ARD_EXT_LED_TURN_TIP = "点亮/熄灭 LED";

Blockly.Blocks.ext_led_turn = {
  init: function() {
    this.setHelpUrl('http://arduino.cc/en/Reference/DigitalWrite');
    this.setColour(Blockly.Blocks.extensions.LED_HUE);

    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.ARD_EXT_LED_TURN_ON, 'on'], [Blockly.Msg.ARD_EXT_LED_TURN_OFF, 'off']]), 'STATE')
        .appendField(Blockly.Msg.ARD_EXT_LED_TURN)
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.extensions.list_led), 'LED');

    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.ARD_EXT_LED_TURN_TIP);
  }
};

Blockly.Arduino.ext_led_turn = function(block) {
  var led = block.getFieldValue('LED');
  var state = block.getFieldValue('STATE');

  var config = Blockly.Blocks.extensions.getConfig("led", led);
  var pin = config.pin;
  var driveMode = config.driveMode;
  state = state === "on" ? (driveMode === "HIGH" ? "HIGH" : "LOW") : (driveMode === "HIGH" ? "LOW" : "HIGH");

  Blockly.Arduino.reservePin(block, pin, Blockly.Arduino.PinTypes.OUTPUT, 'Digital Write');

  var pinSetupCode = 'pinMode(' + pin + ', OUTPUT);';
  Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);

  var code = 'digitalWrite(' + pin + ', ' + state + ');\n';
  return code;
};


Blockly.Msg.ARD_EXT_LED_BRIGHTNESS = "设置LED";
Blockly.Msg.ARD_EXT_LED_BRIGHTNESS_TIP = "设置LED亮度";
Blockly.Msg.ARD_EXT_LED_BRIGHTNESS_TO = "亮度为";

Blockly.Blocks.ext_led_brightness = {
  init: function() {
    this.setHelpUrl('http://arduino.cc/en/Reference/AnalogWrite');
    this.setColour(Blockly.Blocks.extensions.LED_HUE);

    this.appendValueInput('BRIGHTNESS')
        .appendField(Blockly.Msg.ARD_EXT_LED_BRIGHTNESS)
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.extensions.list_led), 'LED')
        .appendField(Blockly.Msg.ARD_EXT_LED_BRIGHTNESS_TO)
        .setCheck(Blockly.Types.NUMBER.output);

    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.ARD_EXT_LED_BRIGHTNESS_TIP);
  }
};

Blockly.Arduino.ext_led_brightness = function(block) {
  var led = block.getFieldValue('LED');
  var brightness = Blockly.Arduino.valueToCode(block, 'BRIGHTNESS', Blockly.Arduino.ORDER_ATOMIC) || '0';

  var config = Blockly.Blocks.extensions.getConfig("led", led);
  var pin = config.pin;
  var driveMode = config.driveMode;

  Blockly.Arduino.reservePin(block, pin, Blockly.Arduino.PinTypes.OUTPUT, 'Analogue Write');

  var pinSetupCode = 'pinMode(' + pin + ', OUTPUT);';
  Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);

  brightness = driveMode === "HIGH" ? brightness : "255 - (" + brightness + ")";

  var code = 'analogWrite(' + pin + ', ' + brightness + ');\n';
  return code;
};
