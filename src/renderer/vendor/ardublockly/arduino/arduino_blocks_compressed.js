// Do not edit this file; automatically generated by build.py.
'use strict';

/*
 Licensed under the Apache License, Version 2.0 (the "License"):
          http://www.apache.org/licenses/LICENSE-2.0
*/
Blockly.Blocks.io={};Blockly.Blocks.io.HUE="#D400D4";
Blockly.Blocks.io_digitalwrite={init:function(){this.setHelpUrl("http://arduino.cc/en/Reference/DigitalWrite");this.setColour(Blockly.Blocks.io.HUE);this.appendValueInput("STATE").appendField(Blockly.Msg.ARD_DIGITALWRITE).appendField(new Blockly.FieldDropdown(Blockly.Arduino.Boards.selected.digitalPins),"PIN").appendField(Blockly.Msg.ARD_WRITE_TO).setCheck(Blockly.Types.BOOLEAN.checkList);this.setInputsInline(!1);this.setPreviousStatement(!0,null);this.setNextStatement(!0,null);this.setTooltip(Blockly.Msg.ARD_DIGITALWRITE_TIP)},
updateFields:function(){Blockly.Arduino.Boards.refreshBlockFieldDropdown(this,"PIN","digitalPins")}};
Blockly.Blocks.io_digitalread={init:function(){this.setHelpUrl("http://arduino.cc/en/Reference/DigitalRead");this.setColour(Blockly.Blocks.io.HUE);this.appendDummyInput().appendField(Blockly.Msg.ARD_DIGITALREAD).appendField(new Blockly.FieldDropdown(Blockly.Arduino.Boards.selected.digitalPins),"PIN");this.setOutput(!0,Blockly.Types.BOOLEAN.output);this.setTooltip(Blockly.Msg.ARD_DIGITALREAD_TIP)},getBlockType:function(){return Blockly.Types.BOOLEAN},updateFields:function(){Blockly.Arduino.Boards.refreshBlockFieldDropdown(this,
"PIN","digitalPins")}};
Blockly.Blocks.io_builtin_led={init:function(){this.setHelpUrl("http://arduino.cc/en/Reference/DigitalWrite");this.setColour(Blockly.Blocks.io.HUE);this.appendValueInput("STATE").appendField(Blockly.Msg.ARD_BUILTIN_LED).appendField(new Blockly.FieldDropdown(Blockly.Arduino.Boards.selected.builtinLed),"BUILT_IN_LED").appendField(Blockly.Msg.ARD_WRITE_TO).setCheck(Blockly.Types.BOOLEAN.checkList);this.setInputsInline(!1);this.setPreviousStatement(!0,null);this.setNextStatement(!0,null);this.setTooltip(Blockly.Msg.ARD_BUILTIN_LED_TIP)},
updateFields:function(){Blockly.Arduino.Boards.refreshBlockFieldDropdown(this,"BUILT_IN_LED","builtinLed")},getBlockType:function(){return Blockly.Types.BOOLEAN}};
Blockly.Blocks.io_analogwrite={init:function(){this.setHelpUrl("http://arduino.cc/en/Reference/AnalogWrite");this.setColour(Blockly.Blocks.io.HUE);this.appendValueInput("NUM").appendField(Blockly.Msg.ARD_ANALOGWRITE).appendField(new Blockly.FieldDropdown(Blockly.Arduino.Boards.selected.pwmPins),"PIN").appendField(Blockly.Msg.ARD_WRITE_TO).setCheck(Blockly.Types.NUMBER.output);this.setInputsInline(!1);this.setPreviousStatement(!0,null);this.setNextStatement(!0,null);this.setTooltip(Blockly.Msg.ARD_ANALOGWRITE_TIP)},
updateFields:function(){Blockly.Arduino.Boards.refreshBlockFieldDropdown(this,"PIN","pwmPins")},getBlockType:function(){return Blockly.Types.NUMBER}};
Blockly.Blocks.io_analogread={init:function(){this.setHelpUrl("http://arduino.cc/en/Reference/AnalogRead");this.setColour(Blockly.Blocks.io.HUE);this.appendDummyInput().appendField(Blockly.Msg.ARD_ANALOGREAD).appendField(new Blockly.FieldDropdown(Blockly.Arduino.Boards.selected.analogPins),"PIN");this.setOutput(!0,Blockly.Types.NUMBER.output);this.setTooltip(Blockly.Msg.ARD_ANALOGREAD_TIP)},getBlockType:function(){return Blockly.Types.NUMBER},updateFields:function(){Blockly.Arduino.Boards.refreshBlockFieldDropdown(this,
"PIN","analogPins")}};Blockly.Blocks.io_highlow={init:function(){this.setHelpUrl("http://arduino.cc/en/Reference/Constants");this.setColour(Blockly.Blocks.io.HUE);this.appendDummyInput().appendField(new Blockly.FieldDropdown([[Blockly.Msg.ARD_HIGH,"HIGH"],[Blockly.Msg.ARD_LOW,"LOW"]]),"STATE");this.setOutput(!0,Blockly.Types.BOOLEAN.output);this.setTooltip(Blockly.Msg.ARD_HIGHLOW_TIP)},getBlockType:function(){return Blockly.Types.BOOLEAN}};
Blockly.Blocks.io_pulsein={init:function(){this.jsonInit({type:"math_foo",message0:Blockly.Msg.ARD_PULSE_READ,args0:[{type:"input_value",name:"PULSETYPE",check:Blockly.Types.BOOLEAN.check},{type:"field_dropdown",name:"PULSEPIN",options:Blockly.Arduino.Boards.selected.digitalPins}],output:Blockly.Types.NUMBER.output,inputsInline:!0,colour:Blockly.Blocks.io.HUE,tooltip:Blockly.Msg.ARD_PULSE_TIP,helpUrl:"https://www.arduino.cc/en/Reference/PulseIn"})},getBlockType:function(){return Blockly.Types.NUMBER}};
Blockly.Blocks.io_pulsetimeout={init:function(){this.jsonInit({type:"math_foo",message0:Blockly.Msg.ARD_PULSE_READ_TIMEOUT,args0:[{type:"input_value",name:"PULSETYPE",check:Blockly.Types.BOOLEAN.check},{type:"field_dropdown",name:"PULSEPIN",options:Blockly.Arduino.Boards.selected.digitalPins},{type:"input_value",name:"TIMEOUT",check:Blockly.Types.NUMBER.check}],output:Blockly.Types.NUMBER.output,inputsInline:!0,colour:Blockly.Blocks.io.HUE,tooltip:Blockly.Msg.ARD_PULSETIMEOUT_TIP,helpUrl:"https://www.arduino.cc/en/Reference/PulseIn"})},
getBlockType:function(){return Blockly.Types.NUMBER}};Blockly.Blocks.logo={};Blockly.Blocks.logo.HUE=180;Blockly.Blocks.ardublockly_name_top={init:function(){this.appendDummyInput().appendField("Ardublockly");this.setPreviousStatement(!0);this.setColour(Blockly.Blocks.logo.HUE)}};Blockly.Blocks.ardublockly_name_bottom={init:function(){this.appendDummyInput().appendField("Ardublockly");this.setNextStatement(!0);this.setColour(Blockly.Blocks.logo.HUE);this.setTooltip("")}};
Blockly.Blocks.ardublockly_plus_top_large={init:function(){this.appendValueInput("NAME").appendField("     +");this.setNextStatement(!0);this.setColour(Blockly.Blocks.logo.HUE)}};Blockly.Blocks.ardublockly_plus_top_small={init:function(){this.appendValueInput("NAME").appendField("  +");this.setNextStatement(!0);this.setColour(Blockly.Blocks.logo.HUE)}};Blockly.Blocks.ardublockly_plus_bottom_large={init:function(){this.appendValueInput("NAME").appendField("     +");this.setPreviousStatement(!0);this.setColour(Blockly.Blocks.logo.HUE)}};
Blockly.Blocks.ardublockly_plus_bottom_small={init:function(){this.appendValueInput("NAME").appendField("  +");this.setPreviousStatement(!0);this.setColour(Blockly.Blocks.logo.HUE)}};Blockly.Blocks.ardublockly_plus_both_small={init:function(){this.appendValueInput("NAME").appendField("  +");this.setPreviousStatement(!0);this.setNextStatement(!0);this.setColour(Blockly.Blocks.logo.HUE)}};
Blockly.Blocks.ardublockly_plus_both_large={init:function(){this.appendValueInput("NAME").appendField("     +");this.setPreviousStatement(!0);this.setNextStatement(!0);this.setColour(Blockly.Blocks.logo.HUE)}};Blockly.Blocks.ardublockly_minus_large={init:function(){this.appendDummyInput().appendField("-     ");this.setInputsInline(!1);this.setOutput(!0);this.setColour(Blockly.Blocks.logo.HUE)}};
Blockly.Blocks.ardublockly_minus_small={init:function(){this.appendDummyInput().appendField("-  ");this.setInputsInline(!1);this.setOutput(!0);this.setColour(Blockly.Blocks.logo.HUE)}};Blockly.Blocks.map={};Blockly.Blocks.map.HUE="#9400D3";
Blockly.Blocks.base_map={init:function(){this.setHelpUrl("http://arduino.cc/en/Reference/map");this.setColour(Blockly.Blocks.map.HUE);this.appendValueInput("NUM").appendField(Blockly.Msg.ARD_MAP).setCheck(Blockly.Types.NUMBER.checkList);this.appendValueInput("DMAX").appendField(Blockly.Msg.ARD_MAP_VAL).setCheck(Blockly.Types.NUMBER.checkList);this.appendDummyInput().appendField("]");this.setInputsInline(!0);this.setOutput(!0);this.setTooltip(Blockly.Msg.ARD_MAP_TIP)},getBlockType:function(){return Blockly.Types.NUMBER}};Blockly.Blocks.procedures.HUE="#3455DB";Blockly.Blocks.arduino_functions={init:function(){this.appendDummyInput().appendField(Blockly.Msg.ARD_FUN_RUN_SETUP);this.appendStatementInput("SETUP_FUNC");this.appendDummyInput().appendField(Blockly.Msg.ARD_FUN_RUN_LOOP);this.appendStatementInput("LOOP_FUNC");this.setInputsInline(!1);this.setColour(Blockly.Blocks.procedures.HUE);this.setTooltip(Blockly.Msg.ARD_FUN_RUN_TIP);this.setHelpUrl("https://arduino.cc/en/Reference/Loop");this.contextMenu=!1},getArduinoLoopsInstance:function(){return!0}};
Blockly.Blocks.arduino_setup={init:function(){this.appendDummyInput().appendField(Blockly.Msg.ARD_FUN_RUN_SETUP);this.appendStatementInput("SETUP_FUNC");this.setInputsInline(!1);this.setColour(Blockly.Blocks.procedures.HUE);this.setTooltip(Blockly.Msg.ARD_FUN_RUN_TIP);this.setHelpUrl("https://arduino.cc/en/Reference/Loop");this.contextMenu=!1},getArduinoLoopsInstance:function(){return!0}};Blockly.Blocks.serial={};Blockly.Blocks.serial.HUE="#002050";
Blockly.Blocks.serial_setup={init:function(){this.setHelpUrl("http://arduino.cc/en/Serial/Begin");this.setColour(Blockly.Blocks.serial.HUE);this.appendDummyInput().appendField(Blockly.Msg.ARD_SERIAL_SETUP).appendField(new Blockly.FieldDropdown(Blockly.Arduino.Boards.selected.serial),"SERIAL_ID").appendField(Blockly.Msg.ARD_SERIAL_SPEED).appendField(new Blockly.FieldDropdown(Blockly.Arduino.Boards.selected.serialSpeed),"SPEED").appendField(Blockly.Msg.ARD_SERIAL_BPS);this.setInputsInline(!0);this.setTooltip(Blockly.Msg.ARD_SERIAL_SETUP_TIP)},
getSerialSetupInstance:function(){return this.getFieldValue("SERIAL_ID")},updateFields:function(){Blockly.Arduino.Boards.refreshBlockFieldDropdown(this,"SERIAL_ID","serial");Blockly.Arduino.Boards.refreshBlockFieldDropdown(this,"SPEED","serialSpeed")}};
Blockly.Blocks.serial_print={init:function(){this.setHelpUrl("http://www.arduino.cc/en/Serial/Print");this.setColour(Blockly.Blocks.serial.HUE);this.appendDummyInput().appendField(new Blockly.FieldDropdown(Blockly.Arduino.Boards.selected.serial),"SERIAL_ID").appendField(Blockly.Msg.ARD_SERIAL_PRINT);this.appendValueInput("CONTENT");this.appendDummyInput().appendField(new Blockly.FieldCheckbox("TRUE"),"NEW_LINE").appendField(Blockly.Msg.ARD_SERIAL_PRINT_NEWLINE);this.setInputsInline(!0);this.setPreviousStatement(!0,
null);this.setNextStatement(!0,null);this.setTooltip(Blockly.Msg.ARD_SERIAL_PRINT_TIP)},onchange:function(a){if(this.workspace&&a.type!=Blockly.Events.MOVE&&a.type!=Blockly.Events.UI){a=this.getFieldValue("SERIAL_ID");for(var b=Blockly.mainWorkspace.getTopBlocks(),d=!1,c=0;c<b.length;c++){var e=b[c].getSerialSetupInstance;if(e&&(e=e.call(b[c]),a==e)){d=!0;break}}d?this.setWarningText(null,"serial_setup"):this.setWarningText(Blockly.Msg.ARD_SERIAL_PRINT_WARN.replace("%1",a),"serial_setup")}},updateFields:function(){Blockly.Arduino.Boards.refreshBlockFieldDropdown(this,
"SERIAL_ID","serial")}};Blockly.Blocks.servo={};Blockly.Blocks.servo.HUE=60;
Blockly.Blocks.servo_write={init:function(){this.setHelpUrl("http://arduino.cc/en/Reference/ServoWrite");this.setColour(Blockly.Blocks.servo.HUE);this.appendDummyInput().appendField(Blockly.Msg.ARD_SERVO_WRITE).appendField(new Blockly.FieldDropdown(Blockly.Arduino.Boards.selected.digitalPins),"SERVO_PIN");this.setInputsInline(!1);this.appendValueInput("SERVO_ANGLE").setCheck(Blockly.Types.NUMBER.checkList).appendField(Blockly.Msg.ARD_SERVO_WRITE_TO);this.appendDummyInput().appendField(Blockly.Msg.ARD_SERVO_WRITE_DEG_180);
this.setInputsInline(!0);this.setPreviousStatement(!0,null);this.setNextStatement(!0,null);this.setTooltip(Blockly.Msg.ARD_SERVO_WRITE_TIP)},updateFields:function(){Blockly.Arduino.Boards.refreshBlockFieldDropdown(this,"SERVO_PIN","digitalPins")}};
Blockly.Blocks.servo_read={init:function(){this.setHelpUrl("http://arduino.cc/en/Reference/ServoRead");this.setColour(Blockly.Blocks.servo.HUE);this.appendDummyInput().appendField(Blockly.Msg.ARD_SERVO_READ).appendField(new Blockly.FieldDropdown(Blockly.Arduino.Boards.selected.digitalPins),"SERVO_PIN");this.setOutput(!0,Blockly.Types.NUMBER.output);this.setTooltip(Blockly.Msg.ARD_SERVO_READ_TIP)},getBlockType:function(){return Blockly.Types.NUMBER},updateFields:function(){Blockly.Arduino.Boards.refreshBlockFieldDropdown(this,
"SERVO_PIN","digitalPins")}};Blockly.Blocks.spi={};Blockly.Blocks.spi.HUE="#002050";
Blockly.Blocks.spi_setup={init:function(){this.setHelpUrl("http://arduino.cc/en/Reference/SPI");this.setColour(Blockly.Blocks.spi.HUE);this.appendDummyInput().appendField(Blockly.Msg.ARD_SPI_SETUP).appendField(new Blockly.FieldDropdown(Blockly.Arduino.Boards.selected.spi),"SPI_ID").appendField(Blockly.Msg.ARD_SPI_SETUP_CONF);this.appendDummyInput().appendField(Blockly.Msg.ARD_SPI_SETUP_SHIFT).appendField(new Blockly.FieldDropdown([[Blockly.Msg.ARD_SPI_SETUP_MSBFIRST,"MSBFIRST"],[Blockly.Msg.ARD_SPI_SETUP_LSBFIRST,
"LSBFIRST"]]),"SPI_SHIFT_ORDER");this.appendDummyInput().appendField(Blockly.Msg.ARD_SPI_SETUP_DIVIDE).appendField(new Blockly.FieldDropdown(Blockly.Arduino.Boards.selected.spiClockDivide),"SPI_CLOCK_DIVIDE");this.appendDummyInput().appendField(Blockly.Msg.ARD_SPI_SETUP_MODE).appendField(new Blockly.FieldDropdown([[Blockly.Msg.ARD_SPI_SETUP_MODE0,"SPI_MODE0"],[Blockly.Msg.ARD_SPI_SETUP_MODE1,"SPI_MODE1"],[Blockly.Msg.ARD_SPI_SETUP_MODE2,"SPI_MODE2"],[Blockly.Msg.ARD_SPI_SETUP_MODE3,"SPI_MODE3"]]),
"SPI_MODE");this.setTooltip(Blockly.Msg.ARD_SPI_SETUP_TIP)},getSpiSetupInstance:function(){return this.getFieldValue("SPI_ID")},updateFields:function(){Blockly.Arduino.Boards.refreshBlockFieldDropdown(this,"SPI_ID","spi");Blockly.Arduino.Boards.refreshBlockFieldDropdown(this,"SPI_CLOCK_DIVIDE","spiClockDivide")}};
Blockly.Blocks.spi_transfer={init:function(){var a=[[Blockly.Msg.ARD_SPI_TRANS_NONE,"none"]].concat(Blockly.Arduino.Boards.selected.digitalPins);this.setHelpUrl("http://arduino.cc/en/Reference/SPITransfer");this.setColour(Blockly.Blocks.spi.HUE);this.appendDummyInput().appendField(new Blockly.FieldDropdown(Blockly.Arduino.Boards.selected.spi),"SPI_ID");this.appendValueInput("SPI_DATA").setCheck(Blockly.Types.NUMBER.checkList).appendField(Blockly.Msg.ARD_SPI_TRANS_VAL);this.appendDummyInput().appendField(Blockly.Msg.ARD_SPI_TRANS_SLAVE).appendField(new Blockly.FieldDropdown(a),
"SPI_SS");this.setInputsInline(!0);this.setPreviousStatement(!0,null);this.setNextStatement(!0,null);this.setTooltip(Blockly.Msg.ARD_SPI_TRANS_TIP)},onchange:function(a){if(this.workspace&&a.type!=Blockly.Events.MOVE&&a.type!=Blockly.Events.UI){a=this.getFieldValue("SPI_ID");for(var b=Blockly.mainWorkspace.getTopBlocks(),d=!1,c=0,e=b.length;c<e;c++){var f=b[c].getSpiSetupInstance;f&&(f=f.call(b[c]),a==f&&(d=!0))}d?this.setWarningText(null,"spi_setup"):this.setWarningText(Blockly.Msg.ARD_SPI_TRANS_WARN1.replace("%1",
a),"spi_setup")}},getBlockType:function(){return Blockly.Types.NUMBER},updateFields:function(){var a=this.getField("SPI_SS"),b=a.getValue();a.menuGenerator_=[[Blockly.Msg.ARD_SPI_TRANS_NONE,"none"]].concat(Blockly.Arduino.Boards.selected.digitalPins);for(var d=!1,c=0,e=a.menuGenerator_.length;c<e;c++)b==a.menuGenerator_[c][1]&&(d=!0);d?this.setWarningText(null,"bPin"):this.setWarningText(Blockly.Msg.ARD_SPI_TRANS_WARN2.replace("%1",b),"bPin")}};
Blockly.Blocks.spi_transfer_return={init:function(){var a=[[Blockly.Msg.ARD_SPI_TRANS_NONE,"none"]].concat(Blockly.Arduino.Boards.selected.digitalPins);this.setHelpUrl("http://arduino.cc/en/Reference/SPITransfer");this.setColour(Blockly.Blocks.spi.HUE);this.appendDummyInput().appendField(new Blockly.FieldDropdown(Blockly.Arduino.Boards.selected.spi),"SPI_ID");this.appendValueInput("SPI_DATA").appendField(Blockly.Msg.ARD_SPI_TRANS_VAL);this.appendDummyInput().appendField(Blockly.Msg.ARD_SPI_TRANS_SLAVE).appendField(new Blockly.FieldDropdown(a),
"SPI_SS");this.setInputsInline(!0);this.setOutput(!0);this.setTooltip(Blockly.Msg.ARD_SPI_TRANSRETURN_TIP)},onchange:Blockly.Blocks.spi_transfer.onchange,getBlockType:Blockly.Blocks.spi_transfer.getBlockType,updateFields:Blockly.Blocks.spi_transfer.updateFields};Blockly.Blocks.stepper={};Blockly.Blocks.stepper.HUE=80;
Blockly.Blocks.stepper_config={init:function(){var a=new Blockly.FieldDropdown([[Blockly.Msg.ARD_STEPPER_TWO_PINS,"TWO"],[Blockly.Msg.ARD_STEPPER_FOUR_PINS,"FOUR"]],function(a){this.sourceBlock_.updateShape_("FOUR"==a)});this.setHelpUrl("http://arduino.cc/en/Reference/StepperConstructor");this.setColour(Blockly.Blocks.stepper.HUE);this.appendDummyInput().appendField(Blockly.Msg.ARD_STEPPER_SETUP).appendField(new Blockly.FieldInstance("Stepper",Blockly.Msg.ARD_STEPPER_DEFAULT_NAME,!0,!0,!1),"STEPPER_NAME").appendField(Blockly.Msg.ARD_STEPPER_MOTOR);
this.appendDummyInput("PINS_DROPDOWN").setAlign(Blockly.ALIGN_RIGHT).appendField(Blockly.Msg.ARD_STEPPER_NUMBER_OF_PINS).appendField(a,"STEPPER_NUMBER_OF_PINS");this.appendDummyInput("PINS").setAlign(Blockly.ALIGN_RIGHT).appendField(Blockly.Msg.ARD_STEPPER_PIN1).appendField(new Blockly.FieldDropdown(Blockly.Arduino.Boards.selected.digitalPins),"STEPPER_PIN1").appendField(Blockly.Msg.ARD_STEPPER_PIN2).appendField(new Blockly.FieldDropdown(Blockly.Arduino.Boards.selected.digitalPins),"STEPPER_PIN2");
this.appendValueInput("STEPPER_STEPS").setCheck(Blockly.Types.NUMBER.checkList).setAlign(Blockly.ALIGN_RIGHT).appendField(Blockly.Msg.ARD_STEPPER_REVOLVS);this.appendValueInput("STEPPER_SPEED").setCheck(Blockly.Types.NUMBER.checkList).setAlign(Blockly.ALIGN_RIGHT).appendField(Blockly.Msg.ARD_STEPPER_SPEED);this.setTooltip(Blockly.Msg.ARD_STEPPER_SETUP_TIP)},domToMutation:function(a){a="FOUR"==a.getAttribute("number_of_pins");this.updateShape_(a)},mutationToDom:function(){var a=document.createElement("mutation"),
b=this.getFieldValue("STEPPER_NUMBER_OF_PINS");a.setAttribute("number_of_pins",b);return a},updateShape_:function(a){var b=this.getFieldValue("STEPPER_PIN3");a?b||this.getInput("PINS").appendField(Blockly.Msg.ARD_STEPPER_PIN3,"PIN3").appendField(new Blockly.FieldDropdown(Blockly.Arduino.Boards.selected.digitalPins),"STEPPER_PIN3").appendField(Blockly.Msg.ARD_STEPPER_PIN4,"PIN4").appendField(new Blockly.FieldDropdown(Blockly.Arduino.Boards.selected.digitalPins),"STEPPER_PIN4"):b&&(this.getInput("PINS").removeField("STEPPER_PIN3"),
this.getInput("PINS").removeField("PIN3"),this.getInput("PINS").removeField("STEPPER_PIN4"),this.getInput("PINS").removeField("PIN4"))},updateFields:function(){Blockly.Boards.refreshBlockFieldDropdown(this,"STEPPER_PIN1","digitalPins");Blockly.Boards.refreshBlockFieldDropdown(this,"STEPPER_PIN2","digitalPins");Blockly.Boards.refreshBlockFieldDropdown(this,"STEPPER_PIN3","digitalPins");Blockly.Boards.refreshBlockFieldDropdown(this,"STEPPER_PIN4","digitalPins")}};
Blockly.Blocks.stepper_step={init:function(){this.setHelpUrl("http://arduino.cc/en/Reference/StepperStep");this.setColour(Blockly.Blocks.stepper.HUE);this.appendDummyInput().appendField(Blockly.Msg.ARD_STEPPER_STEP).appendField(new Blockly.FieldInstance("Stepper",Blockly.Msg.ARD_STEPPER_DEFAULT_NAME,!1,!0,!1),"STEPPER_NAME");this.appendValueInput("STEPPER_STEPS").setCheck(Blockly.Types.NUMBER.checkList);this.appendDummyInput().appendField(Blockly.Msg.ARD_STEPPER_STEPS);this.setPreviousStatement(!0);
this.setNextStatement(!0);this.setTooltip(Blockly.Msg.ARD_STEPPER_STEP_TIP)},onchange:function(a){this.workspace&&a.type!=Blockly.Events.MOVE&&a.type!=Blockly.Events.UI&&(a=this.getFieldValue("STEPPER_NAME"),Blockly.Instances.isInstancePresent(a,"Stepper",this)?this.setWarningText(null):this.setWarningText(Blockly.Msg.ARD_COMPONENT_WARN1.replace("%1",Blockly.Msg.ARD_STEPPER_COMPONENT).replace("%2",a)))}};Blockly.Blocks.time={};Blockly.Blocks.time.HUE="#1E90FF";Blockly.Blocks.time_delay={init:function(){this.setHelpUrl("http://arduino.cc/en/Reference/Delay");this.setColour(Blockly.Blocks.time.HUE);this.appendValueInput("DELAY_TIME_MILI").setCheck(Blockly.Types.NUMBER.checkList).appendField(Blockly.Msg.ARD_TIME_DELAY);this.appendDummyInput().appendField(Blockly.Msg.ARD_TIME_MS);this.setInputsInline(!0);this.setPreviousStatement(!0,null);this.setNextStatement(!0,null);this.setTooltip(Blockly.Msg.ARD_TIME_DELAY_TIP)}};
Blockly.Blocks.time_delaymicros={init:function(){this.setHelpUrl("http://arduino.cc/en/Reference/DelayMicroseconds");this.setColour(Blockly.Blocks.time.HUE);this.appendValueInput("DELAY_TIME_MICRO").setCheck(Blockly.Types.NUMBER.checkList).appendField(Blockly.Msg.ARD_TIME_DELAY);this.appendDummyInput().appendField(Blockly.Msg.ARD_TIME_DELAY_MICROS);this.setInputsInline(!0);this.setPreviousStatement(!0,null);this.setNextStatement(!0,null);this.setTooltip(Blockly.Msg.ARD_TIME_DELAY_MICRO_TIP)}};
Blockly.Blocks.time_millis={init:function(){this.setHelpUrl("http://arduino.cc/en/Reference/Millis");this.setColour(Blockly.Blocks.time.HUE);this.appendDummyInput().appendField(Blockly.Msg.ARD_TIME_MILLIS);this.setOutput(!0,Blockly.Types.LARGE_NUMBER.output);this.setTooltip(Blockly.Msg.ARD_TIME_MILLIS_TIP)},getBlockType:function(){return Blockly.Types.LARGE_NUMBER}};
Blockly.Blocks.time_micros={init:function(){this.setHelpUrl("http://arduino.cc/en/Reference/Micros");this.setColour(Blockly.Blocks.time.HUE);this.appendDummyInput().appendField(Blockly.Msg.ARD_TIME_MICROS);this.setOutput(!0,Blockly.Types.LARGE_NUMBER.output);this.setTooltip(Blockly.Msg.ARD_TIME_MICROS_TIP)},getBlockType:function(){return Blockly.Types.LARGE_NUMBER}};
Blockly.Blocks.infinite_loop={init:function(){this.setHelpUrl("");this.setColour(Blockly.Blocks.time.HUE);this.appendDummyInput().appendField(Blockly.Msg.ARD_TIME_INF);this.setInputsInline(!0);this.setPreviousStatement(!0);this.setTooltip(Blockly.Msg.ARD_TIME_INF_TIP)}};Blockly.Blocks.tone={};Blockly.Blocks.tone.HUE=250;
Blockly.Blocks.io_tone={init:function(){this.appendDummyInput().appendField(Blockly.Msg.ARD_SETTONE).appendField(new Blockly.FieldDropdown(Blockly.Arduino.Boards.selected.digitalPins),"TONEPIN");this.appendValueInput("FREQUENCY").setCheck(Blockly.Types.NUMBER.checkList).appendField(Blockly.Msg.ARD_TONEFREQ);this.setInputsInline(!0);this.setPreviousStatement(!0);this.setNextStatement(!0);this.setColour(Blockly.Blocks.tone.HUE);this.setTooltip(Blockly.Msg.ARD_TONE_TIP);this.setHelpUrl("https://www.arduino.cc/en/Reference/tone")},
onchange:function(a){this.workspace&&a.type!=Blockly.Events.MOVE&&a.type!=Blockly.Events.UI&&(a=Blockly.Arduino.valueToCode(this,"FREQUENCY",Blockly.Arduino.ORDER_ATOMIC),31>a||65535<a?this.setWarningText(Blockly.Msg.ARD_TONE_WARNING,"io_tone"):this.setWarningText(null,"io_tone"))},getBlockType:function(){return Blockly.Types.NUMBER}};
Blockly.Blocks.io_notone={init:function(){this.appendDummyInput().appendField(Blockly.Msg.ARD_NOTONE).appendField(new Blockly.FieldDropdown(Blockly.Arduino.Boards.selected.digitalPins),"TONEPIN");this.setPreviousStatement(!0);this.setNextStatement(!0);this.setColour(Blockly.Blocks.tone.HUE);this.setTooltip(Blockly.Msg.ARD_NOTONE_TIP);this.setHelpUrl("https://www.arduino.cc/en/Reference/noTone")},getBlockType:function(){return Blockly.Types.NUMBER}};Blockly.Blocks.variables.HUE="#DC143C";
Blockly.Blocks.variables_set_type={init:function(){this.setHelpUrl("http://arduino.cc/en/Reference/HomePage");this.setColour(Blockly.Blocks.variables.HUE);this.appendValueInput("VARIABLE_SETTYPE_INPUT");this.appendDummyInput().appendField(Blockly.Msg.ARD_VAR_AS).appendField(new Blockly.FieldDropdown(Blockly.Types.getValidTypeArray()),"VARIABLE_SETTYPE_TYPE");this.setInputsInline(!0);this.setOutput(!0);this.setTooltip(Blockly.Msg.ARD_VAR_AS_TIP)},getBlockType:function(){var a=this.getFieldValue("VARIABLE_SETTYPE_TYPE");
return Blockly.Types[a]}};