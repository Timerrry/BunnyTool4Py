'use strict';
Blockly.Blocks.extensions = Blockly.Blocks.extensions || {};

Blockly.Blocks.extensions.ENCODER_HUE = 210; // 模块颜色 0-360，或者 #abcdef

Blockly.Blocks.extensions.list_encoder = function() {
  return Blockly.Blocks.extensions.genComponentOptions("encoder", [["ENCODER", "ENCODER"]]);
}

Blockly.Msg.ARD_EXT_ENCODER_READ_VALUE = "读取";
Blockly.Msg.ARD_EXT_ENCODER_VALUE = "的值";
Blockly.Msg.ARD_EXT_ENCODER_VALUE_TIP = "读取旋转编码器得数值";

Blockly.Blocks.ext_encoder_value = {
  init: function() {
    this.setHelpUrl('http://arduino.cc/en/Reference/AnalogRead');
    this.setColour(Blockly.Blocks.extensions.ENCODER_HUE);

    this.appendDummyInput()
        .appendField(Blockly.Msg.ARD_EXT_ENCODER_READ_VALUE)
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.extensions.list_encoder), 'ENCODER')
        .appendField(Blockly.Msg.ARD_EXT_ENCODER_VALUE);

    this.setOutput(true, Blockly.Types.NUMBER.output);
    this.setTooltip(Blockly.Msg.ARD_EXT_ENCODER_VALUE_TIP);
  },

  getBlockType: function() {
    return Blockly.Types.NUMBER;
  },
};

Blockly.Arduino.ext_encoder_value = function(block) {
  var encoder = block.getFieldValue('ENCODER');
  var config = Blockly.Blocks.extensions.getConfig("encoder", encoder);

  var pin_sa = config.pin_sa;
  var pin_sb = config.pin_sb;

  Blockly.Arduino.reservePin(block, pin_sa, Blockly.Arduino.PinTypes.INPUT, 'Analog Read');
  Blockly.Arduino.addInclude('ENCODER', '#include <Encoder.h>');

  var varName = encoder.replace(/^(.*)-(\d+)$/, "Encoder-$2");
  var varNameb = encoder.replace(/^(.*)-(\d+)$/, "encoder_$2");
  varName = Blockly.Arduino.variableDB_.getName(varName, Blockly.Variables.NAME_TYPE);
  var globalCode = varName + ' ' + varNameb + '(' + pin_sa + ', ' + pin_sb + ');';
  Blockly.Arduino.addVariable(varName, globalCode, false);

  var pinSetupCodesa = 'pinMode(' + pin_sa + ', INPUT);';
  Blockly.Arduino.addSetup('io_' + pin_sa, pinSetupCodesa, false);

  var pinSetupCodesb = 'pinMode(' + pin_sb + ', INPUT);';
  Blockly.Arduino.addSetup('io_' + pin_sb, pinSetupCodesb, false);

  var code = varNameb + '.read()';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};


Blockly.Msg.ARD_EXT_ENCODER_SET = "设置";
Blockly.Msg.ARD_EXT_ENCODER_SET_TIP = "设置旋转编码器的值";
Blockly.Msg.ARD_EXT_ENCODER_SET_TO = "值为";

Blockly.Blocks.ext_encoder_set = {
  init: function() {
    this.setHelpUrl('http://arduino.cc/en/Reference/AnalogWrite');
    this.setColour(Blockly.Blocks.extensions.ENCODER_HUE);

    this.appendValueInput('SET')
        .appendField(Blockly.Msg.ARD_EXT_ENCODER_SET)
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.extensions.list_encoder), 'ENCODER')
        .appendField(Blockly.Msg.ARD_EXT_ENCODER_SET_TO)
        .setCheck(Blockly.Types.NUMBER.output);

    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.ARD_EXT_ENCODER_SET_TIP);
  }
};

Blockly.Arduino.ext_encoder_set = function(block) {
  var encoder = block.getFieldValue('ENCODER');
  var set = Blockly.Arduino.valueToCode(block, 'SET', Blockly.Arduino.ORDER_ATOMIC) || '0';
  var config = Blockly.Blocks.extensions.getConfig("encoder", encoder);

  var pin_sa = config.pin_sa;
  var pin_sb = config.pin_sb;

  Blockly.Arduino.reservePin(block, pin_sa, Blockly.Arduino.PinTypes.INPUT, 'Analog Read');
  Blockly.Arduino.addInclude('ENCODER', '#include <Encoder.h>');

  var varName = encoder.replace(/^(.*)-(\d+)$/, "Encoder-$2");
  var varNameb = encoder.replace(/^(.*)-(\d+)$/, "encoder_$2");
  varName = Blockly.Arduino.variableDB_.getName(varName, Blockly.Variables.NAME_TYPE);
  var globalCode = varName + ' ' + varNameb + '(' + pin_sa + ', ' + pin_sb + ');';
  Blockly.Arduino.addVariable(varName, globalCode, false);

  var pinSetupCodesa = 'pinMode(' + pin_sa + ', INPUT);';
  Blockly.Arduino.addSetup('io_' + pin_sa, pinSetupCodesa, false);

  var pinSetupCodesb = 'pinMode(' + pin_sb + ', INPUT);';
  Blockly.Arduino.addSetup('io_' + pin_sb, pinSetupCodesb, false);

  var code = varNameb + '.write(' + set + ');\n';
  return code;
};

