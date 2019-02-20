'use strict';
Blockly.Blocks.extensions = Blockly.Blocks.extensions || {};

Blockly.Blocks.extensions.RGB_HUE = 210; // 模块颜色 0-360，或者 #abcdef

Blockly.Blocks.extensions.list_rgb = function() {
  return Blockly.Blocks.extensions.genComponentOptions("rgb", [["三色LED", "三色LED"]]);
}

Blockly.Msg.ARD_EXT_RGB_TO = "设置为";
Blockly.Msg.ARD_EXT_RGB_TURN_ON = "点亮";
Blockly.Msg.ARD_EXT_RGB_TURN_OFF = "熄灭";
Blockly.Msg.ARD_EXT_RGB_TURN_TIP = "打开三色LED";
Blockly.Msg.ARD_EXT_RGB_OFF_TIP = "关闭三色LED";
Blockly.Msg.ARD_EXT_RGB_SET_TIP = "设置三色LED";
Blockly.Msg.ARD_EXT_RGB_FADE_TIP = "三色LED渐变";

Blockly.Msg.ARD_EXT_RGB_WHITE = "白色";
Blockly.Msg.ARD_EXT_RGB_YELLOW = "黄色";
Blockly.Msg.ARD_EXT_RGB_ORANGE = "橙色";
Blockly.Msg.ARD_EXT_RGB_RED = "红色";
Blockly.Msg.ARD_EXT_RGB_GREEN = "绿色";
Blockly.Msg.ARD_EXT_RGB_DARKGREEN = "深绿";
Blockly.Msg.ARD_EXT_RGB_BLUE = "蓝色";
Blockly.Msg.ARD_EXT_RGB_DARKBLUE = "深蓝";
Blockly.Msg.ARD_EXT_RGB_PINK = "粉红";

Blockly.Msg.ARD_EXT_RGB_REDCOLOR = "色值红色为";
Blockly.Msg.ARD_EXT_RGB_GREENCOLOR = "绿色为";
Blockly.Msg.ARD_EXT_RGB_BLUECOLOR = "蓝色为";
Blockly.Msg.ARD_EXT_RGB_FADE = "渐变";
Blockly.Msg.ARD_EXT_RGB_TURN = "让";

Blockly.Blocks.ext_rgb_turn_on = {
  init: function() {
    this.setHelpUrl('http://arduino.cc/en/Reference/noTone');
    this.setColour(Blockly.Blocks.extensions.RGB_HUE);

    this.appendDummyInput()
        .appendField(Blockly.Msg.ARD_EXT_RGB_TURN_ON)
        // .appendField(new Blockly.FieldDropdown([[Blockly.Msg.ARD_EXT_RGB_TURN_ON, 'on'], [Blockly.Msg.ARD_EXT_RGB_TURN_OFF, 'off']]), 'STATE')
        // .appendField(Blockly.Msg.ARD_EXT_RGB_TURN)
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.extensions.list_rgb), 'RGB')
        .appendField(Blockly.Msg.ARD_EXT_RGB_TO)
        .appendField(new Blockly.FieldDropdown([
          [Blockly.Msg.ARD_EXT_RGB_WHITE, '255,255,255'], 
          [Blockly.Msg.ARD_EXT_RGB_YELLOW, '255,255,0'], 
          [Blockly.Msg.ARD_EXT_RGB_ORANGE, '200,50,0'], 
          [Blockly.Msg.ARD_EXT_RGB_RED, '255,0,0'], 
          [Blockly.Msg.ARD_EXT_RGB_DARKGREEN, '0,60,102'], 
          [Blockly.Msg.ARD_EXT_RGB_BLUE, '40,40,255'], 
          [Blockly.Msg.ARD_EXT_RGB_DARKBLUE, '0,0,255'], 
          [Blockly.Msg.ARD_EXT_RGB_PINK, '255,0,255']
        ]), 'COLOR')

    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.ARD_EXT_RGB_TURN_TIP);
  }
};

Blockly.Arduino.ext_rgb_turn_on = function(block) {
  var rgb = block.getFieldValue('RGB');
  var color = block.getFieldValue('COLOR');

  var config = Blockly.Blocks.extensions.getConfig("rgb", rgb);
  var pin_r = config.pin_r;
  var pin_g = config.pin_g;
  var pin_b = config.pin_b;

  Blockly.Arduino.reservePin(block, pin_r, Blockly.Arduino.PinTypes.OUTPUT, 'Digital Write');
  Blockly.Arduino.reservePin(block, pin_g, Blockly.Arduino.PinTypes.OUTPUT, 'Digital Write');
  Blockly.Arduino.reservePin(block, pin_b, Blockly.Arduino.PinTypes.OUTPUT, 'Digital Write');
  
  var varName = rgb.replace(/^(.*)-(\d+)$/, "rgb1_$2");
  varName = Blockly.Arduino.variableDB_.getName(varName, Blockly.Variables.NAME_TYPE);
  var globalCode = 'RGBLed ' + varName + '(' + pin_r + ', ' + pin_g + ', ' + pin_b + ');';

  Blockly.Arduino.addInclude('RGB', '#include <RGBLed.h>');
  Blockly.Arduino.addVariable(varName, globalCode, false);

  var colorSetupCode = varName + '.setRGBcolor(' + color + ');\n';
  // Blockly.Arduino.addSetup('io_' + pin_r, colorSetupCode, false);

  // var code = state === "on" ? 'digitalWrite(' + pin + ', HIGH);\n' : "noTone(" + pin + ");\n";
  return colorSetupCode;
};

Blockly.Blocks.ext_rgb_turn_off = {
  init: function() {
    this.setHelpUrl('http://arduino.cc/en/Reference/noTone');
    this.setColour(Blockly.Blocks.extensions.RGB_HUE);

    this.appendDummyInput()
        .appendField(Blockly.Msg.ARD_EXT_RGB_TURN_OFF)
        // .appendField(new Blockly.FieldDropdown([[Blockly.Msg.ARD_EXT_RGB_TURN_ON, 'on'], [Blockly.Msg.ARD_EXT_RGB_TURN_OFF, 'off']]), 'STATE')
        // .appendField(Blockly.Msg.ARD_EXT_RGB_TURN)
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.extensions.list_rgb), 'RGB')

    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.ARD_EXT_RGB_OFF_TIP);
  }
};

Blockly.Arduino.ext_rgb_turn_off = function(block) {
  var rgb = block.getFieldValue('RGB');
  var color = block.getFieldValue('COLOR');

  var config = Blockly.Blocks.extensions.getConfig("rgb", rgb);
  var pin_r = config.pin_r;
  var pin_g = config.pin_g;
  var pin_b = config.pin_b;

  Blockly.Arduino.reservePin(block, pin_r, Blockly.Arduino.PinTypes.OUTPUT, 'Digital Write');
  Blockly.Arduino.reservePin(block, pin_g, Blockly.Arduino.PinTypes.OUTPUT, 'Digital Write');
  Blockly.Arduino.reservePin(block, pin_b, Blockly.Arduino.PinTypes.OUTPUT, 'Digital Write');
  
  var varName = rgb.replace(/^(.*)-(\d+)$/, "rgb1_$2");
  varName = Blockly.Arduino.variableDB_.getName(varName, Blockly.Variables.NAME_TYPE);
  var globalCode = 'RGBLed ' + varName + '(' + pin_r + ', ' + pin_g + ', ' + pin_b + ');';

  Blockly.Arduino.addInclude('RGB', '#include <RGBLed.h>');
  Blockly.Arduino.addVariable(varName, globalCode, false);

  var colorSetupCode = varName + '.setRGBcolor(0, 0, 0);\n';
  // Blockly.Arduino.addSetup('io_' + pin_r, colorSetupCode, false);

  // var code = state === "on" ? 'digitalWrite(' + pin + ', HIGH);\n' : "noTone(" + pin + ");\n";
  return colorSetupCode;
};

Blockly.Blocks.ext_rgb_set_redcolor = {
  init: function() {
    this.setHelpUrl('http://arduino.cc/en/Reference/tone');
    this.setColour(Blockly.Blocks.extensions.RGB_HUE);

    this.appendDummyInput()
        .appendField(Blockly.Msg.ARD_EXT_RGB_TURN_ON)
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.extensions.list_rgb), 'RGB')
        // .appendField(Blockly.Msg.ARD_EXT_RGB_REDCOLOR)
        // .appendField(new Blockly.FieldDropdown([[Blockly.Msg.ARD_EXT_RGB_TONE_GAMUT_DO, '261'], [Blockly.Msg.ARD_EXT_RGB_TONE_GAMUT_RE, '293'], [Blockly.Msg.ARD_EXT_RGB_TONE_GAMUT_MI, '329'], [Blockly.Msg.ARD_EXT_RGB_TONE_GAMUT_FA, '349'], [Blockly.Msg.ARD_EXT_RGB_TONE_GAMUT_SOL, '392'], [Blockly.Msg.ARD_EXT_RGB_TONE_GAMUT_LA, '440'], [Blockly.Msg.ARD_EXT_RGB_TONE_GAMUT_SI, '494']]), 'GAMUT');
    this.appendDummyInput()
        .appendField(Blockly.Msg.ARD_EXT_RGB_REDCOLOR)
        .appendField(new Blockly.FieldNumber(100), "RGB_R");
    this.appendDummyInput()
        .appendField(Blockly.Msg.ARD_EXT_RGB_GREENCOLOR)
        .appendField(new Blockly.FieldNumber(100), "RGB_G");
    this.appendDummyInput()
        .appendField(Blockly.Msg.ARD_EXT_RGB_BLUECOLOR)
        .appendField(new Blockly.FieldNumber(100), "RGB_B");
    // this.appendValueInput('RGB_R')
    //     .appendField(Blockly.Msg.ARD_EXT_RGB_REDCOLOR)
    //     .setCheck(Blockly.Types.NUMBER.output);
    // this.appendValueInput('RGB_G')
    //     .appendField(Blockly.Msg.ARD_EXT_RGB_GREENCOLOR)
    //     .setCheck(Blockly.Types.NUMBER.output);
    // this.appendValueInput('RGB_B')
    //     .appendField(Blockly.Msg.ARD_EXT_RGB_BLUECOLOR)
    //     .setCheck(Blockly.Types.NUMBER.output);

    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.ARD_EXT_RGB_SET_TIP);

    // var childBlock = this.workspace.newBlock("math_number");
    // childBlock.getField("NUM").setValue("100");
    // this.getInput("RGB_R").connection.connect(childBlock.outputConnection);

    // var childBlock = this.workspace.newBlock("math_number");
    // childBlock.getField("NUM").setValue("100");
    // this.getInput("RGB_G").connection.connect(childBlock.outputConnection);

    // var childBlock = this.workspace.newBlock("math_number");
    // childBlock.getField("NUM").setValue("100");
    // this.getInput("RGB_B").connection.connect(childBlock.outputConnection);
  }
};

Blockly.Arduino.ext_rgb_set_redcolor = function(block) {
  var rgb = block.getFieldValue('RGB');
  var rgb_r = block.getFieldValue('RGB_R');
  var rgb_g = block.getFieldValue('RGB_G');
  var rgb_b = block.getFieldValue('RGB_B');
  // var rgb_r = Blockly.Arduino.valueToCode(block, 'RGB_R', Blockly.Arduino.ORDER_ATOMIC) || '0';
  // var rgb_g = Blockly.Arduino.valueToCode(block, 'RGB_G', Blockly.Arduino.ORDER_ATOMIC) || '0';
  // var rgb_b = Blockly.Arduino.valueToCode(block, 'RGB_B', Blockly.Arduino.ORDER_ATOMIC) || '0';

  var config = Blockly.Blocks.extensions.getConfig("rgb", rgb);
  var pin_r = config.pin_r;
  var pin_g = config.pin_g;
  var pin_b = config.pin_b;

  Blockly.Arduino.reservePin(block, pin_r, Blockly.Arduino.PinTypes.OUTPUT, 'Digital Write');
  Blockly.Arduino.reservePin(block, pin_g, Blockly.Arduino.PinTypes.OUTPUT, 'Digital Write');
  Blockly.Arduino.reservePin(block, pin_b, Blockly.Arduino.PinTypes.OUTPUT, 'Digital Write');
  
  var varName = rgb.replace(/^(.*)-(\d+)$/, "rgb1_$2");
  varName = Blockly.Arduino.variableDB_.getName(varName, Blockly.Variables.NAME_TYPE);
  var globalCode = 'RGBLed ' + varName + '(' + pin_r + ', ' + pin_g + ', ' + pin_b + ');';

  Blockly.Arduino.addInclude('RGB', '#include <RGBLed.h>');
  Blockly.Arduino.addVariable(varName, globalCode, false);

  var colorSetupCode = varName + '.setRGBcolor(' + rgb_r + ', ' + rgb_g + ', ' + rgb_b +');\n';
  // Blockly.Arduino.addSetup('io_' + pin_r, colorSetupCode, false);

  // var code = state === "on" ? 'digitalWrite(' + pin + ', HIGH);\n' : "noTone(" + pin + ");\n";
  return colorSetupCode;
};


Blockly.Blocks.ext_rgb_fade = {
  init: function() {
    this.setHelpUrl('http://arduino.cc/en/Reference/tone');
    this.setColour(Blockly.Blocks.extensions.RGB_HUE);

    this.appendDummyInput()
        .appendField(Blockly.Msg.ARD_EXT_RGB_TURN)
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.extensions.list_rgb), 'RGB')
        .appendField(Blockly.Msg.ARD_EXT_RGB_FADE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.ARD_EXT_RGB_REDCOLOR)
        .appendField(new Blockly.FieldNumber(100), "RGB_R");
    this.appendDummyInput()
        .appendField(Blockly.Msg.ARD_EXT_RGB_GREENCOLOR)
        .appendField(new Blockly.FieldNumber(100), "RGB_G");
    this.appendDummyInput()
        .appendField(Blockly.Msg.ARD_EXT_RGB_BLUECOLOR)
        .appendField(new Blockly.FieldNumber(100), "RGB_B");
    // this.appendValueInput('RGB_R')
    //     .appendField(Blockly.Msg.ARD_EXT_RGB_REDCOLOR)
    //     .setCheck(Blockly.Types.NUMBER.output);
    // this.appendValueInput('RGB_G')
    //     .appendField(Blockly.Msg.ARD_EXT_RGB_GREENCOLOR)
    //     .setCheck(Blockly.Types.NUMBER.output);
    // this.appendValueInput('RGB_B')
    //     .appendField(Blockly.Msg.ARD_EXT_RGB_BLUECOLOR)
    //     .setCheck(Blockly.Types.NUMBER.output);

    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.ARD_EXT_RGB_FADE_TIP);

    // var childBlock = this.workspace.newBlock("math_number");
    // childBlock.getField("NUM").setValue("100");
    // this.getInput("RGB_R").connection.connect(childBlock.outputConnection);

    // var childBlock = this.workspace.newBlock("math_number");
    // childBlock.getField("NUM").setValue("100");
    // this.getInput("RGB_G").connection.connect(childBlock.outputConnection);

    // var childBlock = this.workspace.newBlock("math_number");
    // childBlock.getField("NUM").setValue("100");
    // this.getInput("RGB_B").connection.connect(childBlock.outputConnection);

    // childBlock = this.workspace.newBlock("math_number");
    // childBlock.getField("NUM").setValue("1000");
    // this.getInput("DURATION").connection.connect(childBlock.outputConnection);
  }
};

Blockly.Arduino.ext_rgb_fade = function(block) {
  var rgb = block.getFieldValue('RGB');
  var rgb_r = block.getFieldValue('RGB_R');
  var rgb_g = block.getFieldValue('RGB_G');
  var rgb_b = block.getFieldValue('RGB_B');
  // var rgb_r = Blockly.Arduino.valueToCode(block, 'RGB_R', Blockly.Arduino.ORDER_ATOMIC) || '0';
  // var rgb_g = Blockly.Arduino.valueToCode(block, 'RGB_G', Blockly.Arduino.ORDER_ATOMIC) || '0';
  // var rgb_b = Blockly.Arduino.valueToCode(block, 'RGB_B', Blockly.Arduino.ORDER_ATOMIC) || '0';

  var config = Blockly.Blocks.extensions.getConfig("rgb", rgb);
  var pin_r = config.pin_r;
  var pin_g = config.pin_g;
  var pin_b = config.pin_b;

  Blockly.Arduino.reservePin(block, pin_r, Blockly.Arduino.PinTypes.OUTPUT, 'Digital Write');
  Blockly.Arduino.reservePin(block, pin_g, Blockly.Arduino.PinTypes.OUTPUT, 'Digital Write');
  Blockly.Arduino.reservePin(block, pin_b, Blockly.Arduino.PinTypes.OUTPUT, 'Digital Write');
  
  var varName = rgb.replace(/^(.*)-(\d+)$/, "rgb1_$2");
  varName = Blockly.Arduino.variableDB_.getName(varName, Blockly.Variables.NAME_TYPE);
  var globalCode = 'RGBLed ' + varName + '(' + pin_r + ', ' + pin_g + ', ' + pin_b + ');';

  Blockly.Arduino.addInclude('RGB', '#include <RGBLed.h>');
  Blockly.Arduino.addVariable(varName, globalCode, false);

  var colorSetupCode = varName + '.crossFade(' + rgb_r + ', ' + rgb_g + ', ' + rgb_b +');\n';
  // Blockly.Arduino.addSetup('io_' + pin_r, colorSetupCode, false);

  // var code = state === "on" ? 'digitalWrite(' + pin + ', HIGH);\n' : "noTone(" + pin + ");\n";
  return colorSetupCode;
};
