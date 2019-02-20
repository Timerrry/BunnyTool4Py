'use strict';
Blockly.Blocks.extensions = Blockly.Blocks.extensions || {};

Blockly.Blocks.extensions.IR_SEND_HUE = '#DC143C'; // 模块颜色 0-360，或者 #abcdef

Blockly.Blocks.extensions.list_irSend = function() {
  return Blockly.Blocks.extensions.genComponentOptions("irSend", [["红外发射", "红外发射"]]);
}

Blockly.Msg.ARD_EXT_IR_SEND_NAME = "红外发射";
Blockly.Msg.ARD_EXT_IR_SEND_EMIT = "发射编码";

Blockly.Blocks.ext_irSend_value = {
  init: function() {
    this.setHelpUrl('http://arduino.cc/en/Reference/tone');
    this.setColour(Blockly.Blocks.extensions.BUZZER_HUE);

    this.appendDummyInput()
        .appendField(Blockly.Msg.ARD_EXT_IR_SEND_NAME)
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.extensions.list_irSend), 'BUZZER');
    this.appendDummyInput()
        .appendField(Blockly.Msg.ARD_EXT_IR_SEND_EMIT)
        .appendField(new Blockly.FieldTextInput("0x807F18E7"), "FREQ");
    // this.appendValueInput('FREQ')
    //     .appendField(Blockly.Msg.ARD_EXT_IR_SEND_EMIT)
    //     // .appendField(new Blockly.FieldTextInput('text'), 'FIELDNAME')
    //     .setCheck(null);
    // this.appendDummyInput();

    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.ARD_EXT_IR_SEND_EMIT);
    
    // var childBlock = this.workspace.newBlock('text');
    
    // childBlock.setFieldValue('0x807F18E7', 'TEXT');
    // this.getInput("FREQ").connection.connect(childBlock.outputConnection);
    // childBlock.initSvg();
    // childBlock.render();
    
    // var parentConnection = parentBlock.getInput('TEXT').connection;
    // var childConnection = childBlock.outputConnection;
    // parentConnection.connect(childConnection);

    // var childBlock = this.workspace.newBlock("text");
    // childBlock.getField("NUM").setValue("123");
    // this.getInput("FREQ").connection.connect(childBlock.outputConnection);

    // var childBlock = Blockly.Block.obtain(Blockly.getMainWorkspace(), 'text');
    // childBlock.setFieldValue('Hello', 'FREQ');
    // childBlock.initSvg();
    // childBlock.render();

    // var parentConnection = parentBlock.getInput('FREQ').connection;
    // var childConnection = childBlock.outputConnection;
    // parentConnection.connect(childConnection);
  }
};

Blockly.Arduino.ext_irSend_value = function(block) {
  var irSend = block.getFieldValue('BUZZER');
  var freq = block.getFieldValue('FREQ');
  // var freq = Blockly.Arduino.valueToCode(block, 'FREQ', Blockly.Arduino.ORDER_ATOMIC) || '0';
  // var duration = Blockly.Arduino.valueToCode(block, 'DURATION', Blockly.Arduino.ORDER_ATOMIC) || '0';

  var config = Blockly.Blocks.extensions.getConfig("irSend", irSend);
  var pin = config.pin;

  Blockly.Arduino.reservePin(block, pin, Blockly.Arduino.PinTypes.OUTPUT, 'Analogue Write');
  Blockly.Arduino.addInclude('IR_RECV', '#include <IRremote.h>');

  var varName = irSend.replace(/^(.*)-(\d+)$/, "irSend-$2");
  varName = Blockly.Arduino.variableDB_.getName(varName, Blockly.Variables.NAME_TYPE);
  var globalCode = varName + ' irrecv(' + pin + ');';

  Blockly.Arduino.addVariable(varName, globalCode, false);

  var pinSetupCode = 'pinMode(' + pin + ', OUTPUT);';
  Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);

  var code = 'irsend.sendNEC(' + freq + ', 32);\n';
  return code;
};
