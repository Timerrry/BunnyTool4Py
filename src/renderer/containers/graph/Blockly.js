import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { groupBy, map, fromPairs, throttle } from 'lodash';
import BlocklyComponent from '../../components/graph/Blockly';

import { setWorkspace } from '../../reducers/graph/view';
import { updateBlockly } from '../../reducers/graph/project';

const toolboxTemplate = `
<xml>
  <category id="catLogic" name="逻辑" colour="#00A4A6">
    <block type="controls_if"></block>
    <block type="logic_compare"></block>
    <block type="logic_operation"></block>
    <block type="logic_negate"></block>
    <block type="logic_boolean"></block>
    <block type="logic_null"></block>
    <block type="logic_ternary"></block>
  </category>
  <category id="catLoops" name="循环" colour="#00AA00">
    <block type="controls_repeat_ext">
      <value name="TIMES">
        <block type="math_number">
          <field name="NUM">10</field>
        </block>
      </value>
    </block>
    <block type="controls_whileUntil"></block>
    <block type="controls_for">
      <value name="FROM">
        <block type="math_number">
          <field name="NUM">1</field>
        </block>
      </value>
      <value name="TO">
        <block type="math_number">
          <field name="NUM">10</field>
        </block>
      </value>
      <value name="BY">
        <block type="math_number">
          <field name="NUM">1</field>
        </block>
      </value>
    </block>
    <block type="controls_flow_statements"></block>
  </category>
  <category id="catMath" name="数学" colour="#9400D3">
    <block type="math_number"></block>
    <block type="math_arithmetic"></block>
    <block type="math_single"></block>
    <block type="math_trig"></block>
    <block type="math_constant"></block>
    <block type="math_round"></block>
    <block type="math_modulo"></block>
    <block type="math_random_int">
      <value name="FROM">
        <block type="math_number">
          <field name="NUM">1</field>
        </block>
      </value>
      <value name="TO">
        <block type="math_number">
          <field name="NUM">100</field>
        </block>
      </value>
    </block>
    <block type="base_map"></block>
  </category>
  <category id="catText" name="文本" colour="#B8860B">
    <block type="text"></block>
    <block type="text_join"></block>
    <block type="text_append">
      <value name="TEXT">
        <block type="text"></block>
      </value>
    </block>
    <block type="text_length"></block>
    <block type="text_isEmpty"></block>
    <!--block type="text_trim"></block Need to update block -->
    <!--block type="text_print"></block Part of the serial comms -->
  </category>
  <category id="catVariables" name="变量" colour="#DC143C">
    <block type="variables_get"></block>
    <block type="variables_set"></block>
    <block type="variables_set">
      <value name="VALUE">
        <block type="variables_set_type"></block>
      </value>
    </block>
    <block type="variables_set_type"></block>
  </category>
  <category id="catFunctions" name="函数" custom="PROCEDURE" colour="#3455DB"></category>
  <category id="catInputOutput" name="输入/输出" colour="#D400D4">
    <block type="io_digitalwrite">
      <value name="STATE">
        <block type="io_highlow"></block>
      </value>
    </block>
    <block type="io_digitalread"></block>
    <block type="io_builtin_led">
      <value name="STATE">
        <block type="io_highlow"></block>
      </value>
    </block>
    <block type="io_analogwrite"></block>
    <block type="io_analogread"></block>
    <block type="io_highlow"></block>
    <block type="io_pulsein">
      <value name="PULSETYPE">
        <shadow type="io_highlow"></shadow>
      </value>
    </block>
    <block type="io_pulsetimeout">
      <value name="PULSETYPE">
        <shadow type="io_highlow"></shadow>
      </value>
      <value name="TIMEOUT">
        <shadow type="math_number">
          <field name="NUM">100</field>
        </shadow>
      </value>
    </block>
  </category>
  <category id="catTime" name="时间" colour="#1E90FF">
    <block type="time_delay">
      <value name="DELAY_TIME_MILI">
        <block type="math_number">
          <field name="NUM">1000</field>
        </block>
      </value>
    </block>
    <block type="time_delaymicros">
      <value name="DELAY_TIME_MICRO">
        <block type="math_number">
          <field name="NUM">100</field>
        </block>
      </value>
    </block>
    <block type="time_millis"></block>
    <block type="time_micros"></block>
    <block type="infinite_loop"></block>
  </category>
  <category id="catComms" name="通信" colour="#002050">
    <block type="serial_setup"></block>
    <block type="serial_print"></block>
    <block type="text_prompt_ext">
      <value name="TEXT">
        <block type="text"></block>
      </value>
    </block>
    <block type="spi_setup"></block>
    <block type="spi_transfer"></block>
    <block type="spi_transfer_return"></block>
  </category>
  {PLACEHOLDER}
</xml>
`;

const options = {
  // grid: { spacing: 20 },
  media: 'vendor/ardublockly/blockly/media/',
  sounds: false
  // zoom: {
  //   controls: true,
  //   wheel: true,
  // }
};

class BlocklyContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      configs: {},
      toolbox: toolboxTemplate.replace('{PLACEHOLDER}', ''),
    };

    this._throttleUpdateConfigs = throttle(this._updateConfigs.bind(this), 500);
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.fullscreen !== nextProps.fullscreen || this.props.rightTabActive !== nextProps.rightTabActive || this.props.activeRightTab !== nextProps.activeRightTab || this.props.rightTabWidth !== nextProps.rightTabWidth) {
      this._triggerResize();
    }
    if(this.props.components !== nextProps.components && nextProps.componentConfigs && nextProps.componentConfigs.length > 0) {
      this._throttleUpdateConfigs(nextProps.components, nextProps.componentConfigs);
    }
  }

  _triggerResize() {
    this.timer && clearTimeout(this.timer);
    let count = 5;
    let action = () => {
      this.timer && clearTimeout(this.timer);
      if(count === 0) {
        return;
      }
      window.dispatchEvent(new Event("resize"));
      count--;
      this.timer = setTimeout(action, 200);
    }
    this.timer = setTimeout(action, 200);
  }

  _handleChange(blockly) {
    const { dispatch } = this.props;
    dispatch(updateBlockly(blockly));
  }

  _updateConfigs(components, componentConfigs) {
    let configs = fromPairs(map(groupBy(components, "id"), (items,id) => {
      let config = componentConfigs.find(c => c.id === id);
      return [config.key, items.map(item => {
        return {
          type: config.key,
          name: item.name,
          property: fromPairs(config.properties.map(p => [p.name, (item.property && item.property[p.name] !== undefined) ? item.property[p.name] : p.defaultValue || ""])),
        }
      })];
    }));

    let moduleToolbox = map(configs, (items,key) => {
      let config = componentConfigs.find(c => c.key === key);
      let blocks = config.blocks;
      if(!blocks || blocks.length === 0) {
        return '';
      }
      blocks = blocks.map(b => `<block type="${b}"></block>`);
      return `<category id="ext_${config.key}" name="${config.name}">${blocks.join("")}</category>`;
    }).join("");

    let toolbox = toolboxTemplate.replace("{PLACEHOLDER}", moduleToolbox);
    this.setState({configs, toolbox});
  }

  render() {
    const { dom, board, boards } = this.props;
    const { configs, toolbox } = this.state;
    let boardConfig = boards.find(b => b.name === board);

    return (
      <BlocklyComponent
        toolbox={toolbox}
        options={options}
        value={dom}
        configs={configs}
        board={boardConfig && boardConfig.type || "uno"}
        onChange={::this._handleChange}
      />
    )
  }
}

BlocklyContainer.propTypes = {
  fullscreen: PropTypes.bool.isRequired,
  dom: PropTypes.string.isRequired,
  board: PropTypes.string.isRequired,
  boards: PropTypes.array.isRequired,
  components: PropTypes.array.isRequired,
  componentConfigs: PropTypes.array.isRequired,
  activeRightTab: PropTypes.string.isRequired,
  rightTabActive: PropTypes.bool.isRequired,
  rightTabWidth: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  fullscreen: state.graph.view.fullscreen,
  dom: state.graph.project.blockly.dom,
  board: state.graph.project.board,
  boards: state.graph.config.boards,
  components: state.graph.project.components,
  componentConfigs: state.graph.config.components,
  activeRightTab: state.graph.view.rightTab.tab,
  rightTabActive: state.graph.view.rightTab.active,
  rightTabWidth: state.graph.view.rightTab.width,
});

export default connect(mapStateToProps)(BlocklyContainer);
