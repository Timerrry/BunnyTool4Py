import React, { Component } from 'react';
import { connect } from 'react-redux';
import TopMenuComponent from '../../../components/text/topMenu/TopMenu';

import FileMenu from './FileMenu';
import StartMenu from './StartMenu';
import EditMenu from './EditMenu';
import ProjectMenu from './ProjectMenu';
import SettingMenu from './SettingMenu';

class TopMenu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			collapsed: false,
			activeMenu: 'start',
		};
	}

	_handleToggleMenu(menu) {
		if(menu) {
			this.setState({
				activeMenu: menu === this.state.activeMenu && !this.state.collapsed ? '' : menu,
				collapsed: menu === this.state.activeMenu ? !this.state.collapsed : false,
			});
		} else {
			this.setState({collapsed: !this.state.collapsed});
		}
	}

	render() {
		const { collapsed, activeMenu } = this.state;
		const { onNewProject, onNewPythonProject, onOpenProject, onReadProject, onSaveProject, onSaveAsProject } = this.props;

		return (
			<TopMenuComponent
				collapsed={collapsed}
				activeMenu={activeMenu}
				onToggleMenu={::this._handleToggleMenu}
			>
				<FileMenu
					onNewProject={onNewProject}
					onNewPythonProject={onNewPythonProject}
					onOpenProject={onOpenProject}
					onReadProject={onReadProject}
					onSaveProject={onSaveProject}
					onSaveAsProject={onSaveAsProject}
				/>
				<StartMenu active={activeMenu === "start"} />
				<EditMenu active={activeMenu === "edit"} />
				<ProjectMenu active={activeMenu === "project"} />
				<SettingMenu active={activeMenu === "setting"} />
			</TopMenuComponent>
		);
	}
}

export default TopMenu;
