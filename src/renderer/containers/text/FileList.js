import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Dropdown, Menu, message, Tree} from 'antd';
import {setFileList, setPortId} from '../../reducers/text/config';
import {toggleFilelist, closeFileList} from '../../reducers/text/fileMenu';
import {newFile} from '../../reducers/text/project';
import styles from './FileList.scss';
import {cloneDeep} from "lodash";
import {delayPromise} from "../../lib/util";
// import { setVersion } from '../../reducers/common/setting/version';
// import FileListComponent from '../../components/text/FileList';
// import emitor from '../../lib/emitor';
const DirectoryTree = Tree.DirectoryTree;
const TreeNode = Tree.TreeNode;
const MenuItem = Menu.Item;

class FileList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            input: "",
            output: "",
            buffers: [],
            portId: 0,
            comName: '',
            oldProject: null,
            current: 'none',
        }
    }

    onSelect = () => {
        console.log('Trigger Select');
    };

    onExpand = () => {
        console.log('Trigger Expand');
    };

    handleClick = (e, name) => {
        if (e.key == 'del') {
            this._handleDeleteFile(name)
        }
        if (e.key == 'read') {
            this._handleReadFile(name)
        }
    };

    onRightClickMenu(name) {
        const menu = (
            <Menu onClick={(e) => this.handleClick(e, name)}>
                <MenuItem key="del">删除文件</MenuItem>
                <MenuItem key="read">读取文件</MenuItem>
            </Menu>
        );

        const rightClick = (
            <Dropdown overlay={menu} trigger={['contextMenu']}>
                <span style={{userSelect: 'none'}} onDoubleClick={() => {this._handleReadFile(name)}}>{name}</span>
            </Dropdown>
        );

        return rightClick;
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

    _handleReadFile(name) {
        const {comName, dispatch, editor} = this.props;

        // 整理要运行的代码
        let dataSend = "\x03\r\n\x03\r\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n\x03\n" + "import os\r\n" + "f = open('" + name + "')\r\n" + "f.read()\r\n";

        // 定义延时函数，获取代码后过一段时间再处理和读取
        var delay = function (s) {
            return new Promise(function (resolve, reject) {
                setTimeout(resolve, s);
            });
        };

        message.info("开始读取文件");

        // 关闭所有串口
        bridge.postMessage("serialPort.closeAll");
        dispatch(setPortId(0));
        delayPromise(1200).then(() => {
            bridge.postMessage("serialPort.open", comName, {baudRate: 115200, parser: "raw"})
                .then(portId => {
                    // 清空缓存
                    this._handleClear();
                    // 串口接收
                    this._handleEntered();
                    bridge.postMessage("serialPort.write", portId, dataSend);
                    message.success("正在读取");
                    return delay(2000);
                })
                .then(() => {
                    let {output} = this.state;
                    console.log(123456);
                    console.log(output);

                    // 匹配f.read()和后面字符
                    // console.log(output.indexOf("f.read\(\)\n\'"))
                    // let regex = /f\.read\(\)\n\'[\s\S]*\'/gm;

                    // 正则匹配f.read()及之后的内容
                    let regex = /f\.read\(\)\n\'[\s\S]*\'/gm;
                    // 去掉f.read()
                    let regexa = /\'[\s\S]*\'/gm;
                    if (output.indexOf("f.read\(\)\n\"") > 0) {
                        regex = /f\.read\(\)\n\"[\s\S]*\"/gm;
                        regexa = /\"[\s\S]*\"/gm;
                    }
                    // let regex = /f\.read\(\)\n\'[\s\S]*\'/gm;
                    var myArray = regex.exec(output);
                    console.log(myArray);


                    var myArraya = regexa.exec(myArray[0]);
                    console.log(myArraya[0]);

                    // 由于不支持零宽断言，用字符串截取的方式去掉前后的单引号
                    var myArrayb = myArraya[0].substring(1, myArraya[0].length - 1);

                    var myArrayc = myArrayb.replace(/\\n/g, "\n").replace(/\\r/g, "\r");
                    // let files = JSON.parse(myArraya).sort()
                    // console.log(myArrayc)

                    this._handleNewFile(name, myArrayc);

                    // 修复main.py无法新建和覆盖的错误，
                    // let model = editor.getModel();
                    // model.pushEditOperations([], [{ range: model.getFullModelRange(), text: myArrayc }]);
                    // bridge.postMessage("serialPort.closeAll");
                    return Promise.resolve("done");
                })
                .then(() => {
                    bridge.unlistenMessage("serialPort.onData", true);
                    // 关闭所有串口
                    dispatch(setPortId(0));
                    return bridge.postMessage("serialPort.closeAll");
                })
                // .then((data) => {
                // 	console.log(data)
                // 	// bridge.postMessage("serialPort.closeAll");
                // 	// this._handleFilelist()
                // })
                .catch(err => {
                    console.log(err);
                    message.error("文件读取失败");
                })
        })


    }

    _handleDeleteFile(name) {
        const {comName} = this.props;

        // 整理要运行的代码
        let dataSend = "\x03\n\x03\n\x03\n\x03\n\x03\r\n\x03\r\nimport os\r\nos.remove('" + name + "')\r\n";
        bridge.postMessage("serialPort.closeAll");
        // message.info("测试获取串口列表");
        message.info("正在删除文件");
        delayPromise(1200).then(() => {
            bridge.postMessage("serialPort.open", comName, {baudRate: 115200, parser: "raw"})
                .then(portId => {
                    this._handleClear();
                    this._handleEntered();
                    console.log(dataSend);
                    bridge.postMessage("serialPort.write", portId, dataSend);
                    message.success("删除成功");
                    bridge.postMessage("serialPort.closeAll");
                })
                .then(() => {
                    this._handleFlushList(name, 0);
                })
                .catch(err => {
                    console.log(err);
                    message.warning("串口忙碌中, 请稍等");
                });
        })
    }

    // 文件列表
    _handleFlushList(fn, state) {
        message.success("刷新文件列表");
        const {dispatch, fileList} = this.props;
        let fl = cloneDeep(fileList);
        let fIndex = fl.indexOf(fn);
        if (fIndex === -1 && (state === 1)) {
            fl.push(fn);
        } else if (fIndex !== -1 && (state === 0)) {
            fl.splice(fIndex, 1);
        }
        dispatch(setFileList(fl))
    }

    // 新建文件
    _handleNewFile(name, content) {
        const {dispatch, editor} = this.props;

        let newNmae = name.replace(/(.*\/)*([^.]+).*/ig, "$2");

        let data = {
            name: newNmae,
            content: content,
            language: 'python'
        };

        dispatch(newFile(data));

        setTimeout(() => {
            var model = editor.getModel();
            var line = model.getLineCount();
            var column = model.getLineMaxColumn(line);
            editor.setPosition(new monaco.Position(line, column));
            editor.focus();
        }, 10);

        message.success("新建成功");
    }

    // 关闭文件列表
    _handleCloseFilelist() {
        const {dispatch} = this.props;
        // dispatch(toggleFilelist(false));
        dispatch(dispatch(closeFileList()));
        console.log('close done');
        const {show} = this.props;
        console.log(show)
    }


    render() {
        const {fileList} = this.props;
        const {show} = this.props;
        let showFileList = (<div></div>);

        if (show === true) {
            showFileList = (
                <div className={styles.containerleft}>
                    <div className={styles.all}>
                        <div className={styles.header}>
                            <span className={styles.title}>文件列表</span>
                            <span className={styles.placeholder}></span>
                            <span className={styles.close} onClick={() => this._handleCloseFilelist()}><i
                                className="bunny bunny-close"></i></span>
                        </div>
                        {/* <Dropdown overlay={menu} trigger={['contextMenu']}>
				<span style={{ userSelect: 'none' }}>Right Click on Me</span>
			</Dropdown> */}
                        <DirectoryTree
                            multiple
                            defaultExpandAll
                            // onSelect={this.onSelect}
                            // onExpand={this.onExpand}
                            // onRightClick={this.onRightClick}
                            // className={styles.files}
                        >
                            {fileList.map((filename, index) => <TreeNode className={styles.files}
                                                                         title={this.onRightClickMenu(filename)}
                                                                         key={index}
                                                                         isLeaf/>)}
                            {/* <TreeNode className={styles.files} title={onRightClickMenu} key="0" isLeaf />
				<TreeNode className={styles.files} title="leaf 0-1" key="1" isLeaf />
				<TreeNode className={styles.files} title="leaf 1-0" key="2" isLeaf />
				<TreeNode className={styles.files} title="leaf 1-1" key="3" isLeaf /> */}
                        </DirectoryTree>
                        {/* {this.getNodeTreeRightClickMenu()} */}
                    </div>
                </div>
            )
        } else {
            showFileList = (<div></div>)
        }
        return (
            showFileList
        );
    }

}

FileList.propTypes = {
    // show: PropTypes.bool.isRequired,
    visible: PropTypes.bool.isRequired,
    // message: PropTypes.string.isRequired,
    // projectPath: PropTypes.string.isRequired,
    // buildMessage: PropTypes.string.isRequired,
    // updatedAt: PropTypes.number.isRequired,
    // meta: PropTypes.object.isRequired,
    // buildError: PropTypes.string,
    fileList: PropTypes.array.isRequired,
    comName: PropTypes.string.isRequired,
    editor: PropTypes.object,
};

const mapStateToProps = state => ({
    show: state.text.fileMenu.show,
    visible: state.text.fileMenu.visible,
    // meta: state.common.meta,
    // message: state.text.build.statusMessage,
    // buildMessage: state.text.build.buildMessage,
    // projectPath: state.text.project.path,
    // updatedAt: state.text.project.updatedAt,
    // buildError: state.text.build.buildError,
    comName: state.text.config.port,
    fileList: state.text.config.filelist,
    editor: state.text.editor,
});

export default connect(mapStateToProps)(FileList);
