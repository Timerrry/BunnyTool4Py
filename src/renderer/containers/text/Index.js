import React, {Component} from 'react';
import PropTypes from 'prop-types';
import path from 'path';
import Q from 'q';
import {message, Modal} from 'antd';
import {push} from 'connected-react-router';
import {connect} from 'react-redux';

import TextCoder from '../../components/text/TextCoder';
import Confirm from '../../components/common/Confirm';
import ProjectName from '../../components/common/ProjectName';
import Float from '../../components/common/Float';

import Header from '../common/Header';
import SerialMonitor from '../common/SerialMonitor';
import TopMenu from './topMenu/TopMenu';
import TopBar from './TopBar';
import Editor from './Editor';
import StatusBar from './StatusBar';
import FileList from './FileList';
import LibraryManager from './LibraryManager';

import {stamp} from '../../lib/util';
import {isProjectChange, PROJECT_EXT, PYTHON_EXT, readProject, saveProject} from '../../lib/project';
import emitor from '../../lib/emitor';

import {
    add as addRecentProject,
    load as loadRecentProjects,
    prune as pruneRecentProject
} from '../../reducers/common/setting/recentProjects';
import {toggle as toggleSerialMonitor} from '../../reducers/common/serialMonitor';
import {load as loadEditorSetting} from '../../reducers/common/setting/editor';
import {
    newFile,
    newProject,
    newPythonProject,
    removeFile,
    savedProject,
    setName,
    setProject,
    updateFile
} from '../../reducers/text/project';
import {toggle as toggleLibraryManager} from '../../reducers/text/libraryManager';
import {toggle as toggleFileMenu} from '../../reducers/text/fileMenu';
import {setBoards, setExamples, setPorts} from '../../reducers/text/config';
import {setVersion} from '../../reducers/common/setting/version';


const keyMap = {
    onNewFile: "ctrl+n",
    onRemoveFile: "ctrl+w",
    onSaveProject: "ctrl+s",
    onSaveAsProject: "ctrl+shift+s",
    onOpenProject: "ctrl+o",
    onEsc: "esc",
};

class Index extends Component {

    constructor(props) {
        super(props);

        message.config({
            top: 100,
        });

        this._handleAppBeforeQuit = this._handleAppBeforeQuit.bind(this);
        this._handleSerialPortChange = this._handleSerialPortChange.bind(this);
        this._handleMenuAction = this._handleMenuAction.bind(this);
        this._handleWillSwitch = this._handleWillSwitch.bind(this);

        this.state = {
            oldProject: null,
        };
    }

    componentWillMount() {
        bridge.postMessage("app.unlockSize");
    }

    componentDidMount() {
        const self = this;

        bridge.unlistenMessage("app.onBeforeQuit", true);
        bridge.unlistenMessage("serialPort.onChange", true);
        bridge.unlistenMessage("app.onMenuAction", true);
        bridge.listenMessage("app.onBeforeQuit", this._handleAppBeforeQuit);
        bridge.listenMessage("serialPort.onChange", this._handleSerialPortChange);
        bridge.listenMessage("app.onMenuAction", this._handleMenuAction);

        emitor.on("app.command.new", ::this._handleNewFile);
        emitor.on("app.command.open", ::this._handleOpenProject);
        emitor.on("app.command.save", ::this._handleSaveProject);
        emitor.on("app.command.saveAs", ::this._handleSaveAsProject);
        emitor.on("app.command.delete", ::this._handleRemoveFile);
        emitor.on("app.switch", this._handleWillSwitch);

        this._loadExamples();
        this._listArduino();

        Q.all([
            this._loadSetting(),
            this._loadBoards()
        ]).then(() => {
            const {setting, dispatch} = self.props;
            let project = location.state && location.state.project || null;
            if (project) {
                dispatch(setProject(project));
                this.setState({oldProject: project});
                dispatch(addRecentProject({
                    path: project.path,
                    name: project.name,
                    type: "graph",
                }));
            } else {
                let recentProjects = (setting.recentProjects || []).filter(p => !p.type || p.type === "text");
                if (recentProjects.length > 0) {
                    let recentProject = recentProjects[0];
                    self._handleReadProject(recentProject.path, {
                        message: false,
                        ask: false
                    }).catch(() => dispatch(newProject()));
                } else {
                    dispatch(newProject());
                }
            }
            bridge.postMessage("config.saveSetting", setting);
            setTimeout(() => bridge.postMessage("app.show"), 200);
            // bridge.postMessage("app.show");
        });
    }

    componentWillUnmount() {
        const {dispatch, fileMenuVisible, libraryManagerVisible, serialMonitorVisible} = this.props;

        fileMenuVisible && dispatch(toggleFileMenu(false));
        serialMonitorVisible && dispatch(toggleSerialMonitor(false));
        libraryManagerVisible && dispatch(toggleLibraryManager(false));

        bridge.unlistenMessage("app.onBeforeQuit", this._handleAppBeforeQuit);
        bridge.unlistenMessage("serialPort.onChange", this._handleSerialPortChange);
        bridge.unlistenMessage("app.onMenuAction", this._handleMenuAction);

        emitor.removeAllListeners("app.command.new");
        emitor.removeAllListeners("app.command.open");
        emitor.removeAllListeners("app.command.save");
        emitor.removeAllListeners("app.command.saveAs");
        emitor.removeAllListeners("app.command.delete");
        emitor.removeListener("app.switch", this._handleWillSwitch);
    }

    _handleProjectNameChange(value) {
        const {dispatch} = this.props;
        dispatch(setName(value));
        message.success("重命名成功");
    }

    _handleAppBeforeQuit() {
        let action = () => bridge.postMessage("app.exit");
        this._handleWillSwitch(action);
    }

    _handleWillSwitch(action) {
        const self = this;

        this._askSaveProject(() => {
            const {setting} = self.props;
            Q.all([
                bridge.postMessage("config.saveSetting", setting)
            ]).finally(() => action());
        });
    }

    _handleSerialPortChange() {
        this._listArduino();
    }

    // import a single "py" file to current project
    _handleOpenFile() {
        const {dispatch} = this.props;
        bridge.postMessage("app.showOpenDialog", {
            filters: [
                {name: 'Python', extensions: [PYTHON_EXT]}
            ]
        }).then(
            openPath => {
                let op = openPath.replace(/\\/g, "/");
                bridge.postMessage("fs.read", op)
                    .then(content => {
                        let fn = path.basename(op).split(".")[0];
                        let data = {
                            name: fn,
                            content: content,
                            language: 'python'
                        };
                        dispatch(newFile(data));
                    })
            })
    }

    _handleSaveFile() {
        const {projectName, files, curFileIndex} = this.props;
        let curFile = files[curFileIndex];
        bridge.postMessage("app.showSaveDialog", {
            title: "保存文件",
            buttonLabel: "保存",
            defaultPath: path.join(path.dirname(projectName), curFile.name),
            filters: [
                {name: 'Python', extensions: [PYTHON_EXT]}
            ]
        }).then(
            openPath => {
                let op = openPath.replace(/\\/g, "/");
                bridge.postMessage("fs.write", op, curFile.content)
            })
    }

    _handleNewFile() {
        const {dispatch, editor, files, curFileIndex} = this.props;

        const self = this;

        let file = files[curFileIndex];

        let data = {
            isPython: true,
            language: 'python'
        }

        // if (files.find(f => path.extname(f.name) === '.py')) {
        //     data.language = 'python'
        // }

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

    _handleRenameFile(newName) {
        const {dispatch, curFileIndex, files, projectPath} = this.props;

        const self = this;

        let file = files[curFileIndex];
        if (!newName || file.name === newName) {
            return;
        }
        if (files.find(f => f.name === newName)) {
            message.warn("文件名重复");
            return;
        }
        // if (file.main && !newName.endsWith(path.extname(file.name))) {
        //     message.warn("项目主文件不能更改扩展名");
        //     return;
        // }

        if (!projectPath) {
            dispatch(updateFile(curFileIndex, {name: newName}));
            return;
        }

        Q.all([
            bridge.postMessage("fs.remove", path.join(projectPath, file.name)),
            bridge.postMessage("fs.write", path.join(projectPath, newName)),
        ])
            .then(() => {
                dispatch(updateFile(curFileIndex, {name: newName}));
                let {project} = self.props;
                let updatedAt = stamp();
                return saveProject(projectPath, {...project, updatedAt}, "project")
                    .then(() => dispatch(savedProject(projectPath, updatedAt)));
            })
            .then(() => {
                self.setState({oldProject: self.props.project});
                message.success(`重命名成功`);
            })
            .catch(err => {
                console.log(err);
                message.error("重命名失败");
            });
    }

    _handleRemoveFile(index) {
        const {dispatch, files, curFileIndex, projectPath} = this.props;
        const self = this;

        // if (files.length === 1) {
        //     message.warning("至少保留一个项目文件");
        //     return;
        // }

        let curFile = files[index];
        // if (curFile.main) {
        //     message.warning("项目主文件不能删除");
        //     return;
        // }

        Modal.confirm({
            title: '关闭文件',
            content: `确定要关闭文件“${curFile.name}”吗？`,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                if (!projectPath) {
                    dispatch(removeFile(curFile));
                    return;
                }

                bridge.postMessage("fs.remove", path.join(projectPath, curFile.name))
                    .then(() => dispatch(removeFile(curFile)))
                    .then(() => {
                        let {project} = self.props;
                        let updatedAt = stamp();
                        return saveProject(projectPath, {...project, updatedAt}, "project")
                            .then(() => dispatch(savedProject(projectPath, updatedAt)));
                    })
                    .then(() => {
                        self.setState({oldProject: self.props.project});
                        message.success(`删除成功`);
                    })
                    .catch(err => {
                        console.log(err);
                        message.error(`文件"${curFile.name}"删除失败`)
                    });
            },
        });
    }

    _handleNewProject() {
        this._askSaveProject(() => {
            const {dispatch, editor} = this.props;
            dispatch(newProject());
            setTimeout(() => {
                var model = editor.getModel();
                var line = model.getLineCount();
                var column = model.getLineMaxColumn(line);
                editor.setPosition(new monaco.Position(line, column));
                editor.focus();
            }, 10);

            message.success("新建成功");
            this._hideFileMenu();
        });
    }

    _handleNewPythonProject() {
        this._askSaveProject(() => {
            const {dispatch, editor} = this.props;
            dispatch(newPythonProject());
            setTimeout(() => {
                var model = editor.getModel();
                var line = model.getLineCount();
                var column = model.getLineMaxColumn(line);
                editor.setPosition(new monaco.Position(line, column));
                editor.focus();
            }, 10);

            message.success("新建成功");
            this._hideFileMenu();
        });
    }

    _handleOpenProject() {
        this._askSaveProject(() => {
            const {dispatch, meta} = this.props;
            let projectPath;
            bridge.postMessage("app.showOpenDialog", {
                filters: [
                    {name: meta.name, extensions: [PROJECT_EXT]},
                    {name: 'All Files', extensions: ['*']}
                ]
            })
                .then(openPath => this._handleReadProject(openPath, {ask: false}));
        });
    }

    _handleReadProject(projectPath, options = {}) {
        options = {...{temp: false, message: true, ask: true}, ...options};
        let action = () => {
            let deferred = Q.defer();
            const {dispatch} = this.props;

            readProject(projectPath, options.temp)
                .then(project => {
                    if (project.type === "graph") {
                        Modal.confirm({
                            title: '切换版本',
                            content: `您打开了一个“图形版”项目，是否切换到“图形版”？`,
                            okText: '确定',
                            okType: 'info',
                            cancelText: '取消',
                            onOk() {
                                dispatch(push({pathname: "/graph", state: {project}}));
                                dispatch(setVersion("graph"));
                            },
                        });
                        return;
                    }

                    dispatch(setProject(project));
                    this.setState({oldProject: project});

                    !options.temp && dispatch(addRecentProject({
                        path: project.path,
                        name: project.name,
                        type: project.type || "text",
                    }));
                    options.message && message.success(`打开成功`);
                    deferred.resolve();
                })
                .catch(() => {
                    !options.temp && dispatch(pruneRecentProject(projectPath));
                    options.message && message.error(`打开失败`);
                    deferred.reject();
                });

            this._hideFileMenu();

            return deferred.promise;
        };

        if (options.ask) {
            this._askSaveProject(action);
        } else {
            return action();
        }
    }

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

    _handleEsc() {
        const {dispatch, fileMenuVisible, libraryManagerVisible, serialMonitorVisible} = this.props;

        if (fileMenuVisible) {
            dispatch(toggleFileMenu(false));
            return;
        }
        if (serialMonitorVisible) {
            dispatch(toggleSerialMonitor(false));
            return;
        }
        if (libraryManagerVisible) {
            dispatch(toggleLibraryManager(false));
            return;
        }
    }

    _handleMenuAction(action) {
        switch (action) {
            case "about":
                emitor.emit("app.command.showAbout");
                break;
            case "new":
                emitor.emit("app.command.new");
                break;
            case "open":
                emitor.emit("app.command.open");
                break;
            case "save":
                emitor.emit("app.command.save");
                break;
            case "save-as":
                emitor.emit("app.command.saveAs");
                break;
            case "delete":
                emitor.emit("app.command.delete");
                break;
            case "undo":
                emitor.emit("app.command.undo");
                break;
            case "redo":
                emitor.emit("app.command.redo");
                break;
            case "copy":
                emitor.emit("app.command.copy");
                break;
            case "cut":
                emitor.emit("app.command.cut");
                break;
            case "paste":
                emitor.emit("app.command.paste");
                break;
            case "select-all":
                emitor.emit("app.command.selectAll");
                break;
            case "suggest":
                emitor.emit("app.command.showSuggest");
                message.info("敬请期待");
                break;
            case "check-update":
                emitor.emit("app.command.checkUpdate");
                message.info("敬请期待");
                break;
        }
    }

    _doSave(savePath) {
        let deferred = Q.defer();

        this._hideFileMenu();
        let {dispatch, projectName, project, files} = this.props;

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

    _hideFileMenu() {
        const {dispatch, fileMenuVisible} = this.props;
        fileMenuVisible && dispatch(toggleFileMenu(false));
    }

    _askSaveProject(action) {
        const {project} = this.props;
        const {oldProject} = this.state;

        if (isProjectChange(oldProject, project)) {
            Confirm.show({
                title: "保存项目",
                content: <p>当前项目尚未保存！</p>,
                okText: "保存",
                skipText: "不保存",
                onOK: () => this._handleSaveProject().then(action),
                onSkip: action,
            });
        } else {
            action();
        }
    }

    _loadSetting() {
        const {dispatch} = this.props;

        return bridge.postMessage("config.loadSetting").then(setting => {
            dispatch(loadEditorSetting(setting.editor));
            dispatch(loadRecentProjects(setting.recentProjects));
        })
            .catch(() => {
            });
    }

    _loadBoards() {
        const {dispatch} = this.props;
        return bridge.postMessage("config.loadBoards").then(boards => dispatch(setBoards(boards)));
    }

    _loadExamples() {
        const {dispatch} = this.props;
        return bridge.postMessage("config.loadExamples").then(examples => dispatch(setExamples(examples)));
    }

    _listArduino() {
        const {dispatch} = this.props;
        return bridge.postMessage("arduino.list").then(ports => dispatch(setPorts(ports)));
    }

    render() {
        const {projectName, projectPath, ports} = this.props;
        return (
            <TextCoder
                keyMap={keyMap}
                handlers={{
                    onNewFile: ::this._handleNewFile,
                    onRemoveFile: ::this._handleRemoveFile,
                    onSaveProject: ::this._handleSaveProject,
                    onSaveAsProject: ::this._handleSaveAsProject,
                    onOpenProject: ::this._handleOpenProject,
                    onEsc: ::this._handleEsc,
                }}
                header={
                    <Header>
                        <ProjectName projectName={projectName} projectPath={projectPath}
                                     onProjectNameChange={::this._handleProjectNameChange}/>
                    </Header>
                }
                topMenu={
                    <TopMenu
                        onNewProject={::this._handleNewProject}
                        onNewPythonProject={::this._handleNewPythonProject}
                        onOpenProject={::this._handleOpenProject}
                        onReadProject={::this._handleReadProject}
                        onSaveProject={::this._handleSaveProject}
                        onSaveAsProject={::this._handleSaveAsProject}
                    />
                }
                statusBar={<StatusBar/>}
                fileList={<FileList/>}
                float={
                    <Float>
                        <LibraryManager/>
                        <SerialMonitor ports={ports}/>
                    </Float>
                }
            >
                <TopBar
                    onSaveFile={::this._handleSaveFile}
                    onSaveProject={::this._handleSaveProject}
                    onNewFile={::this._handleNewFile}
                    onRenameFile={::this._handleRenameFile}
                    onRemoveFile={::this._handleRemoveFile}
                    onOpenFile={::this._handleOpenFile}
                />
                <Editor/>
            </TextCoder>
        )
    }
}

Index.propTypes = {
    editor: PropTypes.object,
    meta: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    projectName: PropTypes.string.isRequired,
    projectPath: PropTypes.string.isRequired,
    files: PropTypes.array.isRequired,
    curFileIndex: PropTypes.number.isRequired,
    libraryManagerVisible: PropTypes.bool.isRequired,
    serialMonitorVisible: PropTypes.bool.isRequired,
    fileMenuVisible: PropTypes.bool.isRequired,
    setting: PropTypes.object.isRequired,
    ports: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
    meta: state.common.meta,
    editor: state.text.editor,
    project: state.text.project,
    projectName: state.text.project.name,
    projectPath: state.text.project.path,
    files: state.text.project.files,
    curFileIndex: state.text.project.index,
    libraryManagerVisible: state.text.libraryManager.visible,
    serialMonitorVisible: state.common.serialMonitor.visible,
    fileMenuVisible: state.text.fileMenu.visible,
    setting: state.common.setting,
    ports: state.text.config.ports,
});

export default connect(mapStateToProps)(Index);
