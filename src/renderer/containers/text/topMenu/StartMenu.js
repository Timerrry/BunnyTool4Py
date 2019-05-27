import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {message} from 'antd';
import Q from 'q';
import StartMenuComponent from '../../../components/text/topMenu/StartMenu';
import {toggleFilelist} from '../../../reducers/text/fileMenu';
import {savedProject, setBoard, updateFile} from '../../../reducers/text/project';
import {setFileList, setPort, setPortId, setPorts} from '../../../reducers/text/config';
import {saveProject} from '../../../lib/project';
import {toggle as toggleSerialMonitor} from '../../../reducers/common/serialMonitor';
import {add as addRecentProject} from '../../../reducers/common/setting/recentProjects';
import {delayPromise, stamp} from '../../../lib/util';
import {cloneDeep} from 'lodash';

class StartMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            input: "",
            output: "",
            buffers: [],
            portId: 0,
            comName: '',
            oldProject: null,
        }
    }

    // 打开串口
    _handleOpenSerialPort() {
        const {comName, dispatch, portId} = this.props;
        return bridge.postMessage("serialPort.open", comName, {baudRate: 115200, parser: "raw"})
            .then(portId => {
                dispatch(setPortId(portId));
                return Promise.resolve(portId);
            })
            .catch(err => {
                message.warning("串口忙碌中, 请稍等");
            });
    }

    // 串口状态检测
    _handleSerialPortStatus() {
        const {comName, dispatch, portId} = this.props;
        return bridge.postMessage("serialPort.write", portId, "\r\n")
            .then(() => true)
            .catch(err => {
                console.log(err);
                message.warning("串口忙碌中, 请稍等");
            });
    }

    // 串口连接
    _handleSerialPortConnection() {
        const {comName, dispatch, portId} = this.props;
        if (!portId) {
            // BUG修复：关闭所有串口以保证打开成功率（调试模式下，代码更新后串口不一定关闭）
            bridge.postMessage("serialPort.closeAll")
            // 如果没有portId，就打开串口
            return this._handleOpenSerialPort()
        } else {
            // BUG修复：测试发送一段数据，如果返回一个错误，说明该串口是被占用的
            return this._handleSerialPortStatus()
                .then((e) => {
                    if (e) {
                        return Promise.resolve(portId);
                    } else {
                        // BUG修复：关闭所有串口以保证打开成功率（调试模式下，代码更新后串口不一定关闭）
                        bridge.postMessage("serialPort.closeAll")
                        // portId置0
                        dispatch(setPortId(0));
                        // 如果没有portId，就打开串口
                        return this._handleOpenSerialPort()
                    }
                })
        }
    }

    // 更改串口
    _handlePortChange(_comName) {
        const {dispatch, comName, ports, boardName, boards} = this.props;
        if (_comName === comName) {
            return;
        }
        dispatch(setPort(_comName));

        let a = ports.filter((ports) => {
            if (ports.comName == undefined) {
                return false;
            }
            return ports.comName === _comName
        });

        console.log(a)

        let b = boards.filter((boards) => {
            if (a[0].productId == undefined || a[0].vendorId == undefined) {
                return false;
            }

            if (a[0].productId.toLowerCase() === boards.productId && a[0].vendorId.toLowerCase() === boards.vendorId) {
                dispatch(setBoard(boards.name));
                message.success("已发现" + boards.name + "并自动切换。")
                return true;
            }
            return false;
        });

        if (b.length == 0) {
            message.warn("不能识别出串口" + comName + "使用的设备类型，已默认为ESP32")
            dispatch(setBoard(boards[0].name));
        }

        console.log(b)

    }

    // 自动刷新串口
    _handlePortList() {
        const {dispatch} = this.props;
        // bridge.postMessage("serialPort.onChange")
        bridge.postMessage("arduino.list")
            .then((ports) => {
                console.log(ports)
                dispatch(setPorts(ports))
            })
    }

    // 处理接收到的数据
    _handleSerialPortData(portId, data) {
        if (portId !== this.state.portId) {
            // return;
        }
        const maxBuffer = 500;
        const maxLines = 300;

        // let { autoScroll } = this.props;
        let {buffers} = this.state;

        buffers = buffers.concat(Buffer.isBuffer(data) ? data : Buffer.from(data));
        if (buffers.length > maxBuffer) {
            buffers.splice(0, buffers.length - maxBuffer);
        }

        var result = Buffer.concat(buffers).toString();
        result = result.split(/[\n\r]+/g);
        if (result.length > maxLines) {
            result.splice(0, result.length - maxLines);
        }

        this.setState({output: result.join('\n'), buffers});
    }

    // 开始监听串口
    _handleEntered() {
        // bridge.listenMessage("serialPort.onError", ::this._handleSerialPortError);
        // bridge.listenMessage("serialPort.onClose", ::this._handleSerialPortClose);
        bridge.listenMessage("serialPort.onData", :: this._handleSerialPortData);
    }

    // 清除串口接收
    _handleClear() {
        this.setState({output: "", buffers: []});
    }

    // 上传程序到python中
    _handleUploadPython(afterUp) {
        const self = this;
        const {comName, dispatch, boardName} = this.props;

        if (!comName) {
            message.warn("请先插入设备或者选择端口");
            return;
        }

        if (!this._handleFindMicroPython()) {
            message.warn("不是" + boardName + "开发板，请切换到" + boardName + "开发板再进行文件列表获取");
            return;
        }

        // 获取文件和源码
        const {editor, curFileIndex, files} = this.props;
        const code = editor.getValue();
        let file = files[curFileIndex];


        // 控制台调试，打印一下源码
        // console.log(code);

        let newCode = code.replace(/'/g, "\\'")
        let newCodea = newCode.replace(/\n/g, '\\n').replace(/\r/g, '\\r')
        // console.log(newCodea);
        // 要通过串口发送的数据 Ctrl+C + import os\r\n + f = open(' + file.name + ', 'w')\r\n + f.write(\" + code + \")\r\n + f.close()\r\n
        let dataSend = "\x03\r\n\x03\r\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n" + "import os\r\n" + "f = open('" + file.name + "', 'w')\r\n" + "f.write(\'" + newCodea + "\')\r\n" + "f.close()\r\n"

        console.log(dataSend)
        // 这是一个打开串口的函数，如果判断到串口未打开，则打开串口再传一个promise，告诉串口已经打开了可以发送
        message.info("文件上传中");
        delayPromise(1200).then(() => {
            this._handleSerialPortConnection()
            // 串口发送代码
                .then((portId) => {
                    // const { portId} = this.props;
                    console.log(portId);
                    return bridge.postMessage("serialPort.write", portId, dataSend)
                })
                // 写入成功，弹出提示成功了
                .then(() => {
                    // console.log('portId');
                    message.success("上传成功");
                    this._handleFlushList(file.name, 1);
                    if (afterUp) {
                        afterUp();
                    }
                })
                .catch(err => {
                    console.log("here!!!")
                    console.log(err);
                    message.warning("串口忙碌中, 请稍等");
                })
        })
    }

    // 保存项目
    _handleSaveProject() {
        const {projectPath} = this.props;
        if (!projectPath) {
            return this._handleSaveAsProject();
        }

        const {project, editor, curFileIndex, dispatch} = this.props;
        let deferred = Q.defer();
        dispatch(updateFile(curFileIndex, {content: editor.getValue()}));
        setTimeout(() => {
            this._doSave(projectPath)
                .then(() => deferred.resolve())
                .catch(() => deferred.reject());
        }, 20);

        return deferred.promise;
    }

    // 保存项目为
    _handleSaveAsProject() {
        let deferred = Q.defer();
        const {projectName, project, editor, curFileIndex, dispatch} = this.props;
        dispatch(updateFile(curFileIndex, {content: editor.getValue()}));
        setTimeout(() => {
            bridge.postMessage("app.showSaveDialog", {
                title: "保存项目",
                buttonLabel: "保存",
                defaultPath: projectName,
                filters: [
                    {name: 'All Files', extensions: ["*"]}
                ]
            })
                .then(savePath => this._doSave(savePath))
                .then(() => deferred.resolve())
                .catch(() => deferred.reject());
        }, 20);

        return deferred.promise;
    }

    // 执行保存
    _doSave(savePath) {
        let deferred = Q.defer();

        let {dispatch, projectName, project} = this.props;

        savePath = savePath.replace(/\\/g, "/");
        let updatedAt = stamp();
        saveProject(savePath, {...project, updatedAt}, "all")
            .then(() => {
                dispatch(savedProject(savePath, updatedAt));
                dispatch(addRecentProject({
                    path: savePath,
                    name: projectName,
                    type: "text",
                }));
                this.setState({oldProject: this.props.project});
                message.success('保存成功');
                deferred.resolve();
            })
            .catch(() => {
                message.error('保存失败');
                deferred.reject();
            });

        return deferred.promise;
    }

    // 打开终端
    _handleOpenPythonTerminal() {
        const {visible, comName, dispatch, portId, boardName} = this.props;

        if (!this._handleFindMicroPython()) {
            message.warn("不是" + boardName + "开发板，请切换到" + boardName + "开发板再进行文件列表获取");
            return;
        }

        // 弹出终端
        dispatch(toggleSerialMonitor());

        // 如果是关闭终端，也不执行打开串口操作，直接关闭串口
        if (visible) {
            message.success("终端已关闭，串口已断开！");
            bridge.postMessage("serialPort.closeAll");
            dispatch(setPortId(0));
            // console.log("visible:" + visible)
            return;
        }

        this._handleSerialPortConnection()
            .then((portId) => {
                console.log(portId);
                // dispatch(setPortId(portId));
                message.success("串口 " + comName + " 已被打开，可以开始调试了~");
            })
    }

    // 文件列表
    _handleGetFileList() {
        const {comName, dispatch, boardName, show} = this.props;

        if (show === true) {
            dispatch(toggleFilelist(false));
            return;
        } else if (show === false) {
            dispatch(toggleFilelist(true));
            return;
        }

        if (!this._handleFindMicroPython()) {
            message.warn("不是" + boardName + "开发板，请切换到" + boardName + "开发板再进行文件列表获取");
            return;
        }

        // 整理要运行的代码
        let dataSend = "\x03\r\n\x03\r\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\nimport os\r\nos.listdir()\r\n";


        message.info("开始获取文件列表");

        // 关闭所有串口
        bridge.postMessage("serialPort.closeAll");
        dispatch(setPortId(0));

        // 打开串口，获取文件列表。
        delayPromise(800).then(() => {
            bridge.postMessage("serialPort.open", comName, {baudRate: 115200, parser: "raw"})
                .then(portId => {
                    dispatch(setPortId(portId));
                    // 清空缓存
                    this._handleClear();
                    // 串口接收
                    this._handleEntered();
                    bridge.postMessage("serialPort.write", portId, dataSend);
                    message.success("串口打开成功，开始获取文件列表");
                    return delayPromise(1500);
                })
                .then(() => {
                    let {output} = this.state;
                    console.log(123456)
                    console.log(output)
                    const regex = /\[[\s\S]*\]/gm;
                    var myArray = regex.exec(output);
                    var myArraya = myArray[0].replace(/'/g, '"')
                    let files = JSON.parse(myArraya).sort()
                    // console.log(JSON.parse(myArraya).sort())
                    console.log(files)
                    dispatch(setFileList(files));
                    const {fileList} = this.props;
                    console.log(fileList)
                })
                .then(() => {
                    bridge.unlistenMessage("serialPort.onData", true);
                    // 关闭所有串口
                    bridge.postMessage("serialPort.closeAll");
                    dispatch(setPortId(0));
                    // 打开文件列表
                    dispatch(toggleFilelist(true));
                    console.log('close done')
                    const {show} = this.props;
                    console.log(show)
                })
                .catch(err => {
                    console.log(err);
                    message.error("打开失败");
                })
        })
    }

    // flush file list
    _handleFlushList(fn, state) {
        const {dispatch, fileList, show} = this.props;
        if (show === undefined) return;
        message.success("刷新文件列表");
        let fl = cloneDeep(fileList);
        let fIndex = fl.indexOf(fn)
        if (fIndex === -1 && (state === 1)) {
            fl.push(fn);
        } else if (fIndex !== -1 && (state === 0)) {
            fl.splice(fIndex, 1);
        }
        dispatch(setFileList(fl))
    }

    _handleFindMicroPython() {
        const {comName, ports, boardName, boards} = this.props;

        // 判断选择的板子是MicroPython还是Micro:bit
        let boardId = 0;
        if (boardName == "ESP32") {
            boardId = 0;
        }
        if (boardName == "Micro:bit") {
            boardId = 1;
        }

        let a = ports.some((ports) => {
            if (ports.productId == undefined || ports.vendorId == undefined) {
                return false;
            }
            return ports.comName === comName && ports.productId.toLowerCase() === boards[boardId].productId && ports.vendorId.toLowerCase() === boards[boardId].vendorId;
        });

        return a;
        // console.log(ports)
        // console.log(boards[boardId])
        // console.log(boards)
    }

    _handleRunPythona() {
        const {comName, ports, boardName, boards} = this.props;

        // console.log(boards)
        // console.log(ports)

        // 判断选择的板子是MicroPython还是Micro:bit
        let boardId = 0;
        if (boardName == "MicroPython") {
            boardId = 0;
        }
        if (boardName == "Micro:bit") {
            boardId = 1;
        }

        let a = ports.some((ports) => {
            if (ports.productId == undefined || ports.vendorId == undefined) {
                return false;
            }
            return ports.comName === comName && ports.productId.toLowerCase() === boards[boardId].productId && ports.vendorId.toLowerCase() === boards[boardId].vendorId;
        });

        console.log("板子是否符合要求:" + a)

        // 如果板子串口不对，则搜索一下串口中是否有符合条件的
        if (!a) {
            // message.info("当前串口设备与" + boardName + "不兼容，正在自动搜索串口。")

            let b = this._handleFindBoard(boardName)

            console.log("搜索到的板子[数组]:" + b)

            // 如果搜到了板子（或者多个符合条件的板子）则进行板子切换，默认用第一个板子
            if (b.length == 0) {
                message.warn("很遗憾，我们没有串口列表中找到" + boardName + "开发板。")
                return false;
            }

            if (b.length > 1) {
                message.info("我们在串口列表中找到了" + b.length + "个" + boardName + "开发板，默认选择第一个。")
            }

            message.info("我们在串口列表中找到了" + 1 + "个" + boardName + "开发板，开始自动切换。")
            this._handleAutoSetBoard(boardName, b)

            return true;
        }
    }

    _handleUploadRun() {
        this._handleUploadPython(() => {
            const {dispatch, editor, comName} = this.props;
            // 调用文件和编辑区代码
            bridge.postMessage("serialPort.closeAll");
            delayPromise(800).then(() => {
                bridge.postMessage("serialPort.open", comName, {baudRate: 115200, parser: "raw"})
                    .then(portId => {
                        dispatch(setPortId(portId));
                        const code = editor.getValue();

                        // 要通过串口发送的数据 Ctrl+C + Ctrl+E + CODE + Ctrl+D
                        let dataSend = "\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n" + "\x03\x05" + code + "\x04"

                        // 将格式化的数据发送
                        bridge.postMessage("serialPort.write", portId, dataSend)
                            .then(()=>{
                                message.success("运行上传代码")
                            })
                    })
            })
        })
    }

    // 找符合要求的板子，返回对应的串口及信息（返回的是一个数组对象）
    _handleFindBoard(_boardName) {
        const {comName, ports, boardName, boards} = this.props;

        // 判断选择的板子是MicroPython还是Micro:bit
        let boardId = 0;
        if (_boardName == "ESP32") {
            boardId = 0;
        }
        if (_boardName == "Micro:bit") {
            boardId = 1;
        }

        let a = ports.filter((ports) => {
            if (ports.productId == undefined || ports.vendorId == undefined) {
                return false;
            }
            return ports.productId.toLowerCase() === boards[boardId].productId && ports.vendorId.toLowerCase() === boards[boardId].vendorId
        });

        // console.log(a)

        return a;
    }

    _handleAutoSetBoard(_boardName, _ports) {
        const {dispatch, boardName, comName} = this.props;

        // 如果串口是对的就跳过
        if (_ports[0].comName === comName) {
            return;
        }

        // 设置串口并重新渲染
        dispatch(setPort(_ports[0].comName));
        message.success("已经成功切换串口到" + _ports[0].comName)
    }

    _handleBoardChange(_boardName) {
        const {dispatch, boardName} = this.props;
        if (_boardName === boardName) {
            return;
        }

        dispatch(setBoard(_boardName));

        // message.info("当前串口设备与" + boardName + "不兼容，正在自动搜索串口。")

        let b = this._handleFindBoard(_boardName)

        console.log("搜索到的板子[数组]:" + b)

        // 如果搜到了板子（或者多个符合条件的板子）则进行板子切换，默认用第一个板子
        if (b.length == 0) {
            message.warn("很遗憾，我们没有串口列表中找到" + _boardName + "开发板。")
            return false;
        }

        if (b.length > 1) {
            message.info("我们在串口列表中找到了" + b.length + "个" + _boardName + "开发板，默认选择第一个。")
        }

        message.success("我们在串口列表中找到了" + 1 + "个" + _boardName + "开发板，开始自动切换。")
        this._handleAutoSetBoard(_boardName, b)
    }

    render() {
        const {active, comName, boardName, boards, ports, buildAndUploadLock} = this.props;
        // console.log(ports)

        return (
            <StartMenuComponent
                active={active}
                comName={comName}
                boardName={boardName}
                boards={boards}
                ports={ports}
                buildAndUploadLock={buildAndUploadLock}
                onPortChange={:: this._handlePortChange}
                onBoardChange={:: this._handleBoardChange}
                onPortList={:: this._handlePortList}
                onUploadPython={:: this._handleUploadPython}
                onSaveProject={:: this._handleSaveProject}
                onGetFileList={:: this._handleGetFileList}
                onOpenPythonTerminal={:: this._handleOpenPythonTerminal}
                onRunPython={:: this._handleRunPythona}
                onUploadRun={:: this._handleUploadRun}
            />
        );
    }
}

StartMenu.propTypes = {
    // show: PropTypes.bool.isRequired,
    visible: PropTypes.bool.isRequired,
    active: PropTypes.bool.isRequired,
    project: PropTypes.object.isRequired,
    projectName: PropTypes.string.isRequired,
    boards: PropTypes.array.isRequired,
    boardName: PropTypes.string.isRequired,
    files: PropTypes.array.isRequired,
    curFileIndex: PropTypes.number.isRequired,
    ports: PropTypes.array.isRequired,
    fileList: PropTypes.array.isRequired,
    portId: PropTypes.number.isRequired,
    comName: PropTypes.string.isRequired,
    buildAndUploadLock: PropTypes.bool.isRequired,
    editor: PropTypes.object,
    projectPath: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
    show: state.text.fileMenu.show,
    visible: state.common.serialMonitor.visible,
    meta: state.common.meta,
    editor: state.text.editor,
    project: state.text.project,
    projectKey: state.text.project.key,
    projectPath: state.text.project.path,
    files: state.text.project.files,
    curFileIndex: state.text.project.index,
    projectName: state.text.project.name,
    boardName: state.text.project.board,
    boards: state.text.config.boards,
    ports: state.text.config.ports,
    comName: state.text.config.port,
    fileList: state.text.config.filelist,
    portId: state.text.config.portid,
    buildAndUploadLock: state.text.build.buildAndUploadLock,
});

export default connect(mapStateToProps)(StartMenu);
