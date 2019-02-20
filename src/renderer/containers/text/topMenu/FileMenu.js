import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { newProject } from '../../../reducers/text/project';
import { toggle, switchTab } from '../../../reducers/text/fileMenu';
import FileMenuComponent from '../../../components/text/topMenu/FileMenu';

class FileMenu extends Component {

	_handleToggle(visible) {
    const { dispatch } = this.props;
    dispatch(toggle(visible));
    visible && dispatch(switchTab("recent"));
  }

  _handleSwitchTab(tab) {
    const { dispatch } = this.props;
    dispatch(switchTab(tab));
  }

	render() {
    const { visible, currentTab, examples, recentProjects, onNewProject, onNewPythonProject, onOpenProject, onReadProject, onSaveProject, onSaveAsProject } = this.props;

		return (
			<FileMenuComponent
        visible={visible}
        currentTab={currentTab}
        recentProjects={recentProjects}
        examples={examples}
				onToggle={::this._handleToggle}
        onNewProject={onNewProject}
        onNewPythonProject={onNewPythonProject}
        onOpenProject={onOpenProject}
        onReadProject={onReadProject}
        onSaveProject={onSaveProject}
        onSaveAsProject={onSaveAsProject}
        onSwitchTab={::this._handleSwitchTab}
			/>
		);
	}
}

FileMenu.propTypes = {
  visible: PropTypes.bool.isRequired,
  currentTab: PropTypes.string.isRequired,
	recentProjects: PropTypes.array.isRequired,
  examples: PropTypes.array.isRequired,
  onNewProject: PropTypes.func.isRequired,
  onNewPythonProject: PropTypes.func.isRequired,
  onOpenProject: PropTypes.func.isRequired,
  onReadProject: PropTypes.func.isRequired,
  onSaveProject: PropTypes.func.isRequired,
  onSaveAsProject: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	recentProjects: state.common.setting.recentProjects,
  visible: state.text.fileMenu.visible,
  currentTab: state.text.fileMenu.tab,
  examples: state.text.config.examples,
});

export default connect(mapStateToProps)(FileMenu);
