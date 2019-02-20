import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import path from 'path';
import Q from 'q';
import { Modal, Button, message } from 'antd';
import { push } from 'connected-react-router';
import { sortBy } from 'lodash';

import '../../vendor/ardublockly/dist/blockly';
import '../../vendor/ardublockly/dist/arduino';

import SerialMonitor from '../common/SerialMonitor';
import Header from '../common/Header';
import ProjectName from '../../components/common/ProjectName';
import Float from '../../components/common/Float';
import Confirm from '../../components/common/Confirm';
import GraphCoder from '../../components/graph/GraphCoder';
import TopMenu from './TopMenu';
import ComponentToolbox from './ComponentToolbox';
import ComponentList from './ComponentList';
import BlocklyContainer from './Blockly';
import ComponentDetail from './ComponentDetail';
import Board from './Board';
import Help from './Help';
import CodeView from './CodeView';

import { setPorts, setBoards, setComponents } from '../../reducers/graph/config';
import { toggleFullscreen, toggleRightTab, toggleBoardExpand, switchRightTab } from '../../reducers/graph/view';
import { load as loadRecentProjects, add as addRecentProject, prune as pruneRecentProject } from '../../reducers/common/setting/recentProjects';
import { setName, newProject, savedProject, setProject } from '../../reducers/graph/project';
import { setVersion } from '../../reducers/common/setting/version';

import { readProject, saveProject, isProjectChange, PROJECT_EXT } from '../../lib/project';
import emitor from '../../lib/emitor';
import { stamp, rejectError, loadScript } from '../../lib/util';

const keyMap = {
  onNewProject: "ctrl+n",
	onSaveProject: "ctrl+s",
	onSaveAsProject: "ctrl+shift+s",
	onOpenProject: "ctrl+o",
	onEsc: "esc",
};

class Index extends Component {

	constructor(props) {
		super(props);

		message.config({
      top: 120,
		});

		this.state = {
			oldProject: null,
		};

		this._handleAppBeforeQuit = this._handleAppBeforeQuit.bind(this);
		this._handleSerialPortChange = this._handleSerialPortChange.bind(this);
		// this._handleMenuAction = this._handleMenuAction.bind(this);
		this._handleWillSwitch = this._handleWillSwitch.bind(this);
	}

	componentWillMount() {
		bridge.postMessage("app.unlockSize");
	}

	componentDidMount() {
		const self = this;

		bridge.unlistenMessage("app.onBeforeQuit", true);
		bridge.unlistenMessage("serialPort.onChange", true);
		bridge.listenMessage("app.onBeforeQuit", this._handleAppBeforeQuit);
		bridge.listenMessage("serialPort.onChange", this._handleSerialPortChange);

		emitor.on("app.command.new", ::this._handleNewProject);
		emitor.on("app.command.open", ::this._handleOpenProject);
		emitor.on("app.command.save", ::this._handleSaveProject);
		emitor.on("app.command.saveAs", ::this._handleSaveAsProject);
		emitor.on("app.command.upload", ::this._handleUpload);
		emitor.on("app.switch", this._handleWillSwitch);

		this._listPorts();
		Q.all([
			this._loadSetting(),
			this._loadPackages(),
		]).then(() => {
			const { setting, dispatch, location } = self.props;
			let project = location.state && location.state.project || null;
			if(project) {
				dispatch(setProject(project));
				this.setState({oldProject: project});
				dispatch(addRecentProject({
					path: project.path,
					name: project.name,
					type: "graph",
				}));
			} else {
				let recentProjects = (setting.recentProjects || []).filter(p => p.type && p.type === "graph");
				if(recentProjects.length > 0) {
					let recentProject = recentProjects[0];
					self._handleReadProject(recentProject.path, { message: false, ask: false }).catch(() => dispatch(newProject()));
				} else {
					dispatch(newProject());
				}
			}
			bridge.postMessage("config.saveSetting", setting);
			bridge.postMessage("app.show");
		});
	}

	componentWillUnmount() {
		bridge.unlistenMessage("app.onBeforeQuit", this._handleAppBeforeQuit);
		bridge.unlistenMessage("serialPort.onChange", this._handleSerialPortChange);

		emitor.removeAllListeners("app.command.new");
		emitor.removeAllListeners("app.command.open");
		emitor.removeAllListeners("app.command.save");
		emitor.removeAllListeners("app.command.saveAs");

		emitor.removeListener("app.switch", this._handleWillSwitch);
	}

	_handleAppBeforeQuit() {
		let action = () => bridge.postMessage("app.exit");
		this._handleWillSwitch(action);
	}

	_handleWillSwitch(action) {
		const self = this;

		this._askSaveProject(() => {
			const { setting } = self.props;
			Q.all([
				bridge.postMessage("config.saveSetting", setting)
			]).finally(() => action());
		});
	}

	_handleReadProject(projectPath, options = {}) {
		options = {...{temp: false, message: true, ask: true}, ...options};
		let action = () => {
			let deferred = Q.defer();
			const { dispatch } = this.props;

			readProject(projectPath, options.temp)
			.then(project => {
				if(project.type !== "graph") {
					Modal.confirm({
						title: '切换版本',
						content: `您打开了一个“文本版”项目，是否切换到“文本版”？`,
						okText: '确定',
						okType: 'info',
						cancelText: '取消',
						onOk() {
							dispatch(push({pathname: "/text", state: {project}}));
							dispatch(setVersion("text"));
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

			return deferred.promise;
		};

		if(options.ask) {
			this._askSaveProject(action);
		} else {
			return action();
		}
	}

	_handleSerialPortChange() {
		this._listPorts();
	}

	_handleNewProject() {
		const self = this;
		this._askSaveProject(() => {
			const { dispatch } = self.props;
			dispatch(newProject());

			message.success("新建成功");
		});
	}

	_handleOpenProject() {
		this._askSaveProject(() => {
			const { dispatch, meta } = this.props;
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

	_handleSaveProject() {
		const { projectPath } = this.props;
		if(!projectPath) {
			return this._handleSaveAsProject();
		}

		return this._doSave(projectPath);
	}

	_handleSaveAsProject() {
		let deferred = Q.defer();
		const { projectName, dispatch } = this.props;

		return bridge.postMessage("app.showSaveDialog", {
			title: "保存项目",
			buttonLabel: "保存",
			defaultPath: projectName,
		})
		.then(savePath => this._doSave(savePath))
	}

	_handleUpload() {
		const self = this;
		const { comName, dispatch } = this.props;

		if(!comName) {
			message.warn("请先插入设备或者选择端口");
			return;
		}

		message.success("开始验证", 1);
		this._doBuild().then(
			target => {
				let board = self._getBoard();
				message.success("验证成功，开始上传", 1);
				bridge.postMessage("arduino.upload", { target, comName, upload: board.upload })
				.then(
					() => {
						message.success("上传成功");
					},
					err => {
						console.log(err);
						message.error("上传失败");
					}
				)
			},
			err => {
				console.log(err);
				message.error("验证失败");
			},
		)
	}

	_handleEsc() {
		// console.log('esc');
		const { dispatch, fullscreen, boardExpand } = this.props;
		if(fullscreen) {
			this._handleExitFullscreen();
			return;
		}

		if(boardExpand) {
			dispatch(toggleBoardExpand());
			return;
		}
	}

	_handleProjectNameChange(value) {
    const { dispatch } = this.props;
    dispatch(setName(value));
    message.success("重命名成功");
	}

	_handleExitFullscreen() {
		const { dispatch } = this.props;
		bridge.postMessage("app.fullscreen", false).then(() => {
			dispatch(toggleFullscreen(false));
			dispatch(toggleRightTab(true));
			dispatch(switchRightTab("component-detail"));
		});
	}

	_handleToggleCodeView() {
		const { dispatch } = this.props;
		dispatch(toggleRightTab());
	}

	_listPorts() {
		const { dispatch } = this.props;
    bridge.postMessage("serialPort.list").then(ports => dispatch(setPorts(ports)));
	}

	_loadPackages() {
		const { dispatch } = this.props;
    return bridge.postMessage("config.loadPackages").then(packages => {
			let boards = packages.map(p => p.boards).reduce((sum, item) => sum.concat(item), []);
			boards = sortBy(boards, ["src", "name"]);

			let components = packages.map(p => p.components).reduce((sum, item) => sum.concat(item), []);
			components = sortBy(components, ["blocks", "name"]);

			let scripts = packages.map(p => p.blockly || []).reduce((sum, item) => sum.concat(item), []);
			scripts = boards.concat(components).filter(b => b.src).map(b => b.src).reduce((sum, item) => sum.concat(item), scripts);

			return Q.all(scripts.map(src => loadScript(src))).then(() => {
				dispatch(setBoards(boards));
				dispatch(setComponents(components));
			});
		});
	}

	_loadSetting() {
		const { dispatch } = this.props;

    return bridge.postMessage("config.loadSetting").then(setting => {
			dispatch(loadRecentProjects(setting.recentProjects));
		})
		.catch(() => {});
	}

	_askSaveProject(action) {
		const { project } = this.props;
		const { oldProject } = this.state;

		if(isProjectChange(oldProject, project)) {
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

	_getBoard() {
		const { project, boards } = this.props;
		return boards.find(board => board.name === project.board);
	}

	_doBuild() {
		const { projectPath, projectKey, project, meta} = this.props;
		const self = this;

		let promise;
		let savePath;
		if(!projectPath) {
			promise = bridge.postMessage("app.getAppPath", "temp").then(tempPath => Q.resolve(path.join(tempPath, meta.name, `arduino_${projectKey}`)))
		} else {
			promise = Q.resolve(projectPath);
		}

		return promise.then(_savePath => {
			savePath = _savePath;
			return saveProject(savePath, project, projectPath ? "all" : "code");
		}).then(() => {
			let board = self._getBoard();
			return bridge.postMessage("arduino.build", { key: projectKey, ino: path.join(savePath, "main.ino"), build: board.build });
		});
	}

	_doSave(savePath) {
		let deferred = Q.defer();

		let { dispatch, projectName, project } = this.props;

		savePath = savePath.replace(/\\/g, "/");
		let updatedAt = stamp();
		saveProject(savePath, {...project, updatedAt}, "all")
		.then(() => {
			dispatch(savedProject(savePath, updatedAt));
			dispatch(addRecentProject({
				path: savePath,
				name: projectName,
				type: "graph",
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

  render() {
		const { projectName, projectPath, ports, fullscreen, rightTabActive } = this.props;

    return (
      <GraphCoder
				keyMap={keyMap}
        handlers={{
					onNewProject: ::this._handleNewProject,
					onSaveProject: ::this._handleSaveProject,
					onSaveAsProject: ::this._handleSaveAsProject,
          onOpenProject: ::this._handleOpenProject,
					onEsc: ::this._handleEsc,
        }}
				header={
					<Header style={{backgroundColor: "transparent"}} titleStyle={{color: "rgba(0,0,0,0.85)"}} buttonStyle={{color: "#afafaf"}}>
						<ProjectName projectName={projectName} projectPath={projectPath} onProjectNameChange={::this._handleProjectNameChange} inputStyle={{backgroundColor: "white", color: "rgba(79,79,79,0.85)", borderColor: "#ccc"}} />
					</Header>
				}
				topMenu={<TopMenu />}
				toolbox={<ComponentToolbox />}
				list={<ComponentList />}
				blockly={<BlocklyContainer />}
				board={<Board />}
				detail={<ComponentDetail />}
				codeView={<CodeView />}
				help={<Help />}
				float={
					<Float>
						<SerialMonitor ports={ports} />
					</Float>
				}
				fullscreen={fullscreen}
				rightTabActive={rightTabActive}
				onExitFullscreen={::this._handleExitFullscreen}
				onToggleCodeView={::this._handleToggleCodeView}
			/>
    )
  }
}

Index.propTypes = {
	meta: PropTypes.object.isRequired,
	project: PropTypes.object.isRequired,
	projectName: PropTypes.string.isRequired,
	projectPath: PropTypes.string.isRequired,
	comName: PropTypes.string.isRequired,
	ports: PropTypes.array.isRequired,
	boards: PropTypes.array.isRequired,
	fullscreen: PropTypes.bool.isRequired,
	setting: PropTypes.object.isRequired,
	boardExpand: PropTypes.bool.isRequired,
	rightTabActive: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
	meta: state.common.meta,
	project: state.graph.project,
	projectName: state.graph.project.name,
	projectPath: state.graph.project.path,
	comName: state.graph.config.port,
	ports: state.graph.config.ports,
	boards: state.graph.config.boards,
	fullscreen: state.graph.view.fullscreen,
	setting: state.common.setting,
	boardExpand: state.graph.view.boardExpand,
	rightTabActive: state.graph.view.rightTab.active,
});

export default connect(mapStateToProps)(Index);
