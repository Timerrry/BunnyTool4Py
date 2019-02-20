import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { message } from 'antd';
import ProjectMenuComponent from '../../../components/text/topMenu/ProjectMenu';
import { toggle as toggleLibraryManager } from '../../../reducers/text/libraryManager';

import { toggle as toggleSerialMonitor } from '../../../reducers/common/serialMonitor';

class ProjectMenu extends Component {

	_handleExportCode() {
		const { files, curFileIndex } = this.props;
		let curFile = files[curFileIndex];

		bridge.postMessage("fs.save", curFile.name, curFile.content)
		.then(() => message.success("导出成功"));
	}

	_handleToggleLibraryManager() {
		const { dispatch } = this.props;
		dispatch(toggleLibraryManager());
	}

	_handleToggleBoardManager() {
		message.info("敬请期待");
	}

	render() {
		const { active } = this.props;

		return (
			<ProjectMenuComponent
				active={active}
				onExportCode={::this._handleExportCode}
				onToggleLibraryManager={::this._handleToggleLibraryManager}
				onToggleBoardManager={::this._handleToggleBoardManager}
			/>
		);
	}
}

ProjectMenu.propTypes = {
	active: PropTypes.bool.isRequired,
	files: PropTypes.array.isRequired,
	curFileIndex: PropTypes.number.isRequired,
	editor: PropTypes.object,
};

const mapStateToProps = state => ({
	editor: state.text.editor,
	files: state.text.project.files,
	curFileIndex: state.text.project.index,
});

export default connect(mapStateToProps)(ProjectMenu);
