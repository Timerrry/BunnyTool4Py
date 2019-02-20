'use strict';
Blockly.Blocks.extensions = Blockly.Blocks.extensions || {};

Blockly.Blocks.extensions.BUZZER_HUE = 210; // 模块颜色 0-360，或者 #abcdef

Blockly.Blocks.extensions.list_buzzer = function() {
  return Blockly.Blocks.extensions.genComponentOptions("buzzer", [["蜂鸣器", "蜂鸣器"]]);
}

Blockly.Msg.ARD_EXT_BUZZER_TURN = "蜂鸣器";
Blockly.Msg.ARD_EXT_BUZZER_TURN_ON = "打开";
Blockly.Msg.ARD_EXT_BUZZER_TURN_OFF = "关闭";
Blockly.Msg.ARD_EXT_BUZZER_TURN_TIP = "打开/关闭蜂鸣器";

Blockly.Blocks.ext_buzzer_turn = {
  init: function() {
    this.setHelpUrl('http://arduino.cc/en/Reference/noTone');
    this.setColour(Blockly.Blocks.extensions.BUZZER_HUE);

    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.ARD_EXT_BUZZER_TURN_ON, 'on'], [Blockly.Msg.ARD_EXT_BUZZER_TURN_OFF, 'off']]), 'STATE')
        .appendField(Blockly.Msg.ARD_EXT_BUZZER_TURN)
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.extensions.list_buzzer), 'BUZZER');

    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.ARD_EXT_BUZZER_TURN_TIP);
  }
};

Blockly.Arduino.ext_buzzer_turn = function(block) {
  var buzzer = block.getFieldValue('BUZZER');
  var state = block.getFieldValue('STATE');

  var config = Blockly.Blocks.extensions.getConfig("buzzer", buzzer);
  var pin = config.pin;

  Blockly.Arduino.reservePin(block, pin, Blockly.Arduino.PinTypes.OUTPUT, 'Digital Write');

  var pinSetupCode = 'pinMode(' + pin + ', OUTPUT);';
  Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);

  var code = state === "on" ? 'digitalWrite(' + pin + ', HIGH);\n' : "noTone(" + pin + ");\n";
  return code;
};


Blockly.Msg.ARD_EXT_BUZZER_TONE_GAMUT_NAME = "蜂鸣器";
Blockly.Msg.ARD_EXT_BUZZER_TONE_GAMUT_EMIT = "发出音阶";
Blockly.Msg.ARD_EXT_BUZZER_TONE_GAMUT_DO = "Do";
Blockly.Msg.ARD_EXT_BUZZER_TONE_GAMUT_RE = "Re";
Blockly.Msg.ARD_EXT_BUZZER_TONE_GAMUT_MI = "Mi";
Blockly.Msg.ARD_EXT_BUZZER_TONE_GAMUT_FA = "Fa";
Blockly.Msg.ARD_EXT_BUZZER_TONE_GAMUT_SOL = "Sol";
Blockly.Msg.ARD_EXT_BUZZER_TONE_GAMUT_LA = "La";
Blockly.Msg.ARD_EXT_BUZZER_TONE_GAMUT_SI = "Si";
Blockly.Msg.ARD_EXT_BUZZER_TONE_GAMUT_DURATION = "持续";
Blockly.Msg.ARD_EXT_BUZZER_TONE_GAMUT_MS = "毫秒";
Blockly.Msg.ARD_EXT_BUZZER_TONE_GAMUT_TIP = "蜂鸣器发出标准音阶";

Blockly.Blocks.ext_buzzer_tone_gamut = {
  init: function() {
    this.setHelpUrl('http://arduino.cc/en/Reference/tone');
    this.setColour(Blockly.Blocks.extensions.BUZZER_HUE);

    this.appendDummyInput()
        .appendField(Blockly.Msg.ARD_EXT_BUZZER_TONE_GAMUT_NAME)
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.extensions.list_buzzer), 'BUZZER')
        .appendField(Blockly.Msg.ARD_EXT_BUZZER_TONE_GAMUT_EMIT)
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.ARD_EXT_BUZZER_TONE_GAMUT_DO, '261'], [Blockly.Msg.ARD_EXT_BUZZER_TONE_GAMUT_RE, '293'], [Blockly.Msg.ARD_EXT_BUZZER_TONE_GAMUT_MI, '329'], [Blockly.Msg.ARD_EXT_BUZZER_TONE_GAMUT_FA, '349'], [Blockly.Msg.ARD_EXT_BUZZER_TONE_GAMUT_SOL, '392'], [Blockly.Msg.ARD_EXT_BUZZER_TONE_GAMUT_LA, '440'], [Blockly.Msg.ARD_EXT_BUZZER_TONE_GAMUT_SI, '494']]), 'GAMUT');
    this.appendDummyInput()
        .appendField(Blockly.Msg.ARD_EXT_BUZZER_TONE_GAMUT_DURATION)
        .appendField(new Blockly.FieldNumber(100), "DURATION");
        
    // this.appendValueInput('DURATION')
    //     .appendField(new Blockly.FieldTextInput("default"), "NAME")
    //     .appendField(Blockly.Msg.ARD_EXT_BUZZER_TONE_GAMUT_DURATION)
    //     .setCheck(Blockly.Types.NUMBER.output);
    this.appendDummyInput()
        .appendField(Blockly.Msg.ARD_EXT_BUZZER_TONE_GAMUT_MS);

    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.ARD_EXT_BUZZER_TONE_GAMUT_TIP);

    // var childBlock = this.workspace.newBlock("math_number");
    // childBlock.getField("NUM").setValue("1000");
    // this.getInput("DURATION").connection.connect(childBlock.outputConnection);
  }
};

Blockly.Arduino.ext_buzzer_tone_gamut = function(block) {
  var buzzer = block.getFieldValue('BUZZER');
  var gamut = block.getFieldValue('GAMUT');
  var duration = block.getFieldValue('DURATION');
  // var duration = Blockly.Arduino.valueToCode(block, 'DURATION', Blockly.Arduino.ORDER_ATOMIC) || '0';

  var config = Blockly.Blocks.extensions.getConfig("buzzer", buzzer);
  var pin = config.pin;

  Blockly.Arduino.reservePin(block, pin, Blockly.Arduino.PinTypes.OUTPUT, 'Analogue Write');

  var pinSetupCode = 'pinMode(' + pin + ', OUTPUT);';
  Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);

  var code = 'tone(' + pin + ', ' + gamut + ', ' + duration + ');\n';
  return code;
};


Blockly.Msg.ARD_EXT_BUZZER_TONE_FREQ_NAME = "蜂鸣器";
Blockly.Msg.ARD_EXT_BUZZER_TONE_FREQ_EMIT = "发出频率";
Blockly.Msg.ARD_EXT_BUZZER_TONE_FREQ_DURATION = "持续";
Blockly.Msg.ARD_EXT_BUZZER_TONE_FREQ_MS = "毫秒";

Blockly.Blocks.ext_buzzer_tone_freq = {
  init: function() {
    this.setHelpUrl('http://arduino.cc/en/Reference/tone');
    this.setColour(Blockly.Blocks.extensions.BUZZER_HUE);

    this.appendDummyInput()
        .appendField(Blockly.Msg.ARD_EXT_BUZZER_TONE_FREQ_NAME)
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.extensions.list_buzzer), 'BUZZER');
    this.appendDummyInput()
        .appendField(Blockly.Msg.ARD_EXT_BUZZER_TONE_FREQ_EMIT)
        .appendField(new Blockly.FieldNumber(261), "FREQ");
    this.appendDummyInput()
        .appendField(Blockly.Msg.ARD_EXT_BUZZER_TONE_GAMUT_DURATION)
        .appendField(new Blockly.FieldNumber(1000), "DURATION");
    // this.appendValueInput('FREQ')
    //     .appendField(Blockly.Msg.ARD_EXT_BUZZER_TONE_FREQ_EMIT)
    //     .setCheck(Blockly.Types.NUMBER.output);
    // this.appendValueInput('DURATION')
    //     .appendField(Blockly.Msg.ARD_EXT_BUZZER_TONE_GAMUT_DURATION)
    //     .setCheck(Blockly.Types.NUMBER.output);
    this.appendDummyInput()
        .appendField(Blockly.Msg.ARD_EXT_BUZZER_TONE_GAMUT_MS);

    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.ARD_EXT_BUZZER_TONE_GAMUT_TIP);

    // var childBlock = this.workspace.newBlock("math_number");
    // childBlock.getField("NUM").setValue("261");
    // this.getInput("FREQ").connection.connect(childBlock.outputConnection);

    // childBlock = this.workspace.newBlock("math_number");
    // childBlock.getField("NUM").setValue("1000");
    // this.getInput("DURATION").connection.connect(childBlock.outputConnection);
  }
};

Blockly.Arduino.ext_buzzer_tone_freq = function(block) {
  var buzzer = block.getFieldValue('BUZZER');
  var freq = block.getFieldValue('FREQ');
  var duration = block.getFieldValue('DURATION');
  // var freq = Blockly.Arduino.valueToCode(block, 'FREQ', Blockly.Arduino.ORDER_ATOMIC) || '0';
  // var duration = Blockly.Arduino.valueToCode(block, 'DURATION', Blockly.Arduino.ORDER_ATOMIC) || '0';

  var config = Blockly.Blocks.extensions.getConfig("buzzer", buzzer);
  var pin = config.pin;

  Blockly.Arduino.reservePin(block, pin, Blockly.Arduino.PinTypes.OUTPUT, 'Analogue Write');

  var pinSetupCode = 'pinMode(' + pin + ', OUTPUT);';
  Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);

  var code = 'tone(' + pin + ', ' + freq + ', ' + duration + ');\n';
  return code;
};
