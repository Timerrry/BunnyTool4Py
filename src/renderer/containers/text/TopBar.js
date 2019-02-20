import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { message } from 'antd';
import path from 'path';
import Q from 'q';
import { unset, cloneDeep } from 'lodash';
import TopBarComponent from '../../components/text/TopBar';
import emitor from '../../lib/emitor';
import { switchFile, updateFile, removeFile } from '../../reducers/text/project';

class TopBar extends Component {

	componentDidMount() {
		emitor.on("app.command.undo", ::this._handleUndo);
		emitor.on("app.command.redo", ::this._handleRedo);
	}

	componentWillUnmount() {
		emitor.removeAllListeners("app.command.undo");
		emitor.removeAllListeners("app.command.redo");
	}

	_handleUndo() {
		const { editor } = this.props;
		editor.trigger('', 'undo');
	}

	_handleRedo() {
		const { editor } = this.props;
		editor.trigger('', 'redo');
	}

	_handleSwitchFile(index) {
		const { dispatch } = this.props;
		dispatch(switchFile(index));
	}

	render() {
		const { files, curFileIndex, onNewFile, onSaveProject, onRemoveFile, onRenameFile } = this.props;

		return (
			<TopBarComponent
				files={files}
				curFileIndex={curFileIndex}
				onSaveProject={onSaveProject}
				onUndo={::this._handleUndo}
				onRedo={::this._handleRedo}
				onNewFile={onNewFile}
				onSwitchFile={::this._handleSwitchFile}
				onRenameFile={onRenameFile}
				onRemoveFile={onRemoveFile}
			/>
		);
	}
}

TopBar.propTypes = {
	editor: PropTypes.object,
	files: PropTypes.array.isRequired,
	curFileIndex: PropTypes.number.isRequired,
	onNewFile: PropTypes.func.isRequired,
	onSaveProject: PropTypes.func.isRequired,
	onRemoveFile: PropTypes.func.isRequired,
	onRenameFile: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	editor: state.text.editor,
	files: state.text.project.files,
	curFileIndex: state.text.project.index,
});

export default connect(mapStateToProps)(TopBar);
