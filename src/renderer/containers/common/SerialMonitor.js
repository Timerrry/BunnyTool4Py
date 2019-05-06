import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { trim } from 'lodash';
import { message } from 'antd';
import SerialMonitorComponent from '../../components/common/SerialMonitor';

import { resize, toggle, setPort, setLineEnding, setBaudrate, toggleAutoScroll, comportId } from '../../reducers/common/serialMonitor';

import { setPortId } from '../../reducers/text/config';

const maxBuffer = 500;
const maxLines = 300;

class SerialMonitor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      input: "",
      output: "",
      buffers: [],
      portId: 0,
      comName: '',
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.ports !== this.props.ports || !this.props.comName) {
      let ports = nextProps.ports;
      let { comName } = this.state;
      comName = ports.find(p => p.comName === comName) ? comName : (ports.length > 0 ? ports[0].comName : "");
      this.setState({comName});
    }
  }

  _handleEntered() {
    bridge.listenMessage("serialPort.onError", ::this._handleSerialPortError);
    bridge.listenMessage("serialPort.onClose", ::this._handleSerialPortClose);
    bridge.listenMessage("serialPort.onData", ::this._handleSerialPortData);
  }

  _handleExited() {
    bridge.unlistenMessage("serialPort.onError", true);
    bridge.unlistenMessage("serialPort.onClose", true);
    bridge.unlistenMessage("serialPort.onData", true);

    const { portId } = this.props;
    portId && bridge.postMessage("serialPort.close", portId);
    this.setState({portId: 0, input: "", comName: ''});
    this._handleClear();
  }

  _handleSerialPortError(portId, err) {
    if(portId !== this.state.portId) {
      return;
    }

    console.log(err);
    message.warn("串口出错");
  }

  _handleSerialPortClose(portId) {
    if(portId !== this.props.portId) {
      return;
    }

    this.setState({portId: 0});
  }

  _handleSerialPortData(portId, data) {
    if(portId !== this.props.portId) {
      return;
    }

    let { autoScroll } = this.props;
    let { buffers } = this.state;

    buffers = buffers.concat(Buffer.isBuffer(data) ? data : Buffer.from(data));
		if(buffers.length > maxBuffer) {
			buffers.splice(0, buffers.length - maxBuffer);
		}

		var result = Buffer.concat(buffers).toString();
		result = result.split(/[\n\r]+/g);
		if(result.length > maxLines) {
			result.splice(0, result.length - maxLines);
		}

    this.setState({ output: result.join('\n'), buffers });
    autoScroll && setTimeout(() => {
      this.outputRef.scrollTop = this.outputRef.scrollHeight;
    }, 10);
  }

  _handleHide() {
    const { dispatch } = this.props;
    dispatch(toggle(false));
  }

  _handleResizeStop(delta) {
    const { dispatch, height } = this.props;
    dispatch(resize(height + delta.height));
  }

  _handleInputChange(e) {
    this.setState({input: e.target.value});
  }

  _handleSend() {
    const { input, output } = this.state;
    let { portId } = this.props;
    if(!portId) {
      message.warn("请进入调试模式");
      return;
    }
    let data = "\x03\x05" + input + "\x04";
    console.log(data)
    bridge.postMessage("serialPort.write", portId, data)
    .catch(err => {
      console.log(err);
      message.error("串口发送失败");
    });
    this.setState({input: ""});
  }

  _handleClear() {
    this.setState({output: "", buffers: []});
  }

  _handleAutoScrollChange(autoScroll) {
    const { dispatch } = this.props;
    dispatch(toggleAutoScroll(autoScroll));
  }

  _handleOpenSerial() {
    const { portId } = this.props;
    const { comName } = this.props;
    const { dispatch } = this.props;
    if(portId) {
      bridge.postMessage("serialPort.close", portId)
      .then(() => {
        // this.setState({portId: 0});
        dispatch(setPortId(0));
        message.success("关闭成功");
      });
      return;
    }

    if(!comName) {
      message.warn("请选择端口");
      return;
    }

    bridge.postMessage("serialPort.open", comName, { baudRate: 115200, parser: "raw" })
    .then(portId => {
      this._handleClear();
      dispatch(setPortId(portId));
      // this.setState({portId});
      this.inputRef.focus();
      message.success("串口打开成功");
    })
    .catch(err => {
      console.log(err);
      message.error("串口打开失败，请再试一次");

      // 如果串口被占用而portId仍然为0，则关闭所有串口。开发模式需要，生产模式可以去掉。
      bridge.postMessage("serialPort.closeAll");
    });
  }

  _handleRunPython() {
    // 调用文件和编辑区代码
		const { editor, curFileIndex, files } = this.props;
		const code = editor.getValue();

    // 打开串口并进入调试模式
    const { portId } = this.props;

    // 要通过串口发送的数据 Ctrl+C + Ctrl+E + CODE + Ctrl+D
    let dataSend = "\x03\x05" + code + "\x04"

    // 将格式化的数据发送
    bridge.postMessage("serialPort.write", portId, dataSend)
    .catch(err => {
      console.log(err);
      message.error("调试中断!");
    });
  }

  _handleSendCtrlC(){
    const { portId } = this.props;
    bridge.postMessage("serialPort.write", portId, "\x03")
  }

  _handlePortChange(comName) {
    this.setState({comName});
  }

  _handleLineEndingChange(lineEnding) {
    const { dispatch } = this.props;
    dispatch(setLineEnding(lineEnding));
  }

  _handleBaudrateChange(baudrate) {
    const { dispatch } = this.props;
    dispatch(setBaudrate(baudrate));
  }

  _setInputRef(ref) {
    this.inputRef = ref;
  }

  _setOutputRef(ref) {
    this.outputRef = ref;
  }

  _handleUploadPythonTest() {
		const self = this;
    const { comName, dispatch} = this.props;
    const { portId } = this.props;

		if(!comName) {
			message.warn("请先插入设备或者选择端口");
			return;
		}

		// 上传之前关闭所有串口（因为调试模式的串口没关会导致上传失败）
		// bridge.postMessage("serialPort.closeAll")

		// 同步延时函数
		var delay = function(s){
			return new Promise(function(resolve,reject){
			 setTimeout(resolve,s); 
			});
		};

		// 获取文件和源码
		const { editor, curFileIndex, files } = this.props;
		const code = editor.getValue();
		let file = files[curFileIndex];

		// 控制台调试，打印一下源码
		console.log(code);

		// 要通过串口发送的数据 Ctrl+C + import os\r\n + f = open(' + file.name + ', 'w')\r\n + f.write(\" + code + \")\r\n + f.close()\r\n
		let dataSend = "\x03\r\n\x03\r\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n" + "import os\r\n" + "fd = open('" + file.name + "', 'w')\r\n" + "f = fd.write(" + code + ")\r\n" + "f.close()\r\n"

		// // 打开串口
		// bridge.postMessage("serialPort.open", comName, { baudRate: 115200, parser: "raw" })
		// // 写入程序
    // .then(portId => {
			bridge.postMessage("serialPort.write", portId, dataSend)
		// })
		// 写入成功，弹出提示成功了
		.then(() => {
      message.success("上传成功");
		})
		// 关闭所有串口
		.then(() => {
      // bridge.postMessage("serialPort.closeAll");
    })
    .catch(err => {
      console.log(err);
      message.error("串口打开失败，上传失败");
		});
	}

  render() {
    const { input, output } = this.state;
    const { comName, portId } = this.props;
    const { visible, height, autoScroll, ports, lineEnding, baudrate } = this.props;

    return (
      <SerialMonitorComponent
        visible={visible}
        height={height}
        connected={!!portId}
        input={input}
        output={output}
        autoScroll={autoScroll}
        comName={comName}
        ports={ports}
        lineEnding={lineEnding}
        baudrate={baudrate}
        onEntered={::this._handleEntered}
        onExited={::this._handleExited}
        setInputRef={::this._setInputRef}
        setOutputRef={::this._setOutputRef}
        onHide={::this._handleHide}
        onResizeStop={::this._handleResizeStop}
        onInputChange={::this._handleInputChange}
        onSend={::this._handleSend}
        onClear={::this._handleClear}
        onAutoScrollChange={::this._handleAutoScrollChange}
        onOpenSerial={::this._handleOpenSerial}
        onRunPython={::this._handleRunPython}
        onPortChange={::this._handlePortChange}
        onLineEndingChange={::this._handleLineEndingChange}
        onBaudrateChange={::this._handleBaudrateChange}
        onSendCtrlC={::this._handleSendCtrlC}
        onUploadPythonTest={::this._handleUploadPythonTest}
      />
    )
  }
}

SerialMonitor.propTypes = {
  visible: PropTypes.bool.isRequired,
  height: PropTypes.number.isRequired,
  autoScroll: PropTypes.bool.isRequired,
  lineEnding: PropTypes.string.isRequired,
  baudrate: PropTypes.number.isRequired,
  ports: PropTypes.array.isRequired,
  editor: PropTypes.object,
  files: PropTypes.array.isRequired,
  curFileIndex: PropTypes.number.isRequired,
  comName: PropTypes.string.isRequired,
  portId: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  visible: state.common.serialMonitor.visible,
  editor: state.text.editor,
  files: state.text.project.files,
	curFileIndex: state.text.project.index,
  height: state.common.serialMonitor.height,
  autoScroll: state.common.serialMonitor.autoScroll,
  lineEnding: state.common.serialMonitor.lineEnding,
  baudrate: state.common.serialMonitor.baudrate,
  comName: state.text.config.port,
  portId: state.text.config.portid,
});

export default connect(mapStateToProps)(SerialMonitor);
