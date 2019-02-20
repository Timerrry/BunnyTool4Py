import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';
import { HotKeys } from 'react-hotkeys';
import classNames from 'classnames';
import Moment from 'react-moment';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';

import styles from './FileMenu.scss';

const menuStyles = {
	enter: styles.menuEnter,
	enterActive: styles.menuEnterActive,
	exit: styles.menuExit,
  exitActive: styles.menuExitActive,
};

const FileMenu = ({ visible, currentTab, recentProjects, examples, onToggle, onNewProject, onNewPythonProject, onBrowseOpenProject, onReadProject, onSaveProject, onSaveAsProject, onOpenProject,  onSwitchTab }) => {
	return (
		<span>
			<div className={styles.file} onClick={() => onToggle(true)}>文件</div>
			<span className={styles.menuWrap}>
				<HotKeys handlers={{"esc": () => onToggle(false)}}>
					<CSSTransition in={visible} timeout={200} classNames={menuStyles} unmountOnExit>
						<div className={styles.menu}>
							<div className={styles.left}>
								<span className={styles.back} onClick={() => onToggle(false)}>
									<span className={styles.backIcon}>
										<svg className="timerry-icon" aria-hidden="true">
											<use xlinkHref="#icon-icon_fanhuijiantou"></use>
										</svg>
									</span>
									<span>返回</span>
								</span>
								{/* <span className={styles.action} onClick={onNewProject}>新建项目</span> */}
								<span className={styles.action} onClick={onNewPythonProject}>新建项目</span>
								<span className={classNames(styles.action, styles.open)}>打开</span>
								<span className={styles.action} onClick={onSaveProject}>保存项目</span>
								<span className={styles.action} onClick={onSaveAsProject}>另存项目</span>
								<span className={styles.placeholder}></span>
							</div>
							<div className={styles.center}>
								<span className={classNames(styles.category, {[styles.categoryActive]: currentTab === "recent"})} onClick={() => onSwitchTab("recent")}>最近项目</span>
								<span className={styles.divider}></span>
								<span className={classNames(styles.category, {[styles.categoryActive]: currentTab === "examples"})} onClick={() => onSwitchTab("examples")}>示例项目</span>
								<Tooltip placement="bottom" title="打开项目" mouseEnterDelay={0.5}>
									<span className={styles.browser} onClick={onOpenProject}>浏览</span>
								</Tooltip>
							</div>
							<div className={styles.right}>
								<div className={classNames(styles.tab, styles.recentTab, {[styles.tabActive]: currentTab === "recent"})}>
									<div className={styles.theader}>
										<span className={styles.projectNameTitle}>项目</span>
										<span className={styles.projectPathTitle}>路径</span>
										<span className={styles.lastOpenAtTitle}>上次打开时间</span>
									</div>
									<div className={styles.divider}></div>
									{recentProjects.map((project, index) => (
									<div className={styles.row} key={index}>
										<span className={styles.projectName}><span className={styles.projectNameContent} onClick={() => onReadProject(project.path)}>{project.name}</span></span>
										<span className={styles.projectPath}><span className={styles.projectPathContent} onClick={() => onReadProject(project.path)}>{project.path}</span></span>
										<span className={styles.lastOpenAt}><Moment format="M月D日 HH:mm" unix>{project.lastOpenAt}</Moment></span>
									</div>
									))}
								</div>
								<div className={classNames(styles.tab, styles.examplesTab, {[styles.tabActive]: currentTab === "examples"})}>
									<div className={styles.theader}>
										<span className={styles.projectNameTitle}>项目</span>
										<span className={styles.placeholder}></span>
										<span className={styles.projectCategoryTitle}>分类</span>
									</div>
									<div className={styles.divider}></div>
									{examples.map((example, index) => (
									<div className={styles.row} key={index}>
										<span className={styles.projectName}><span className={styles.projectNameContent} onClick={() => onReadProject(example.path, { temp: true })}>{example.name}</span></span>
										<span className={styles.placeholder}></span>
										<span className={styles.projectCategory}>{example.category}</span>
									</div>
									))}
								</div>
							</div>
						</div>
					</CSSTransition>
				</HotKeys>
			</span>
		</span>
	);
};

FileMenu.propTypes = {
	visible: PropTypes.bool.isRequired,
	currentTab: PropTypes.string.isRequired,
	recentProjects: PropTypes.array.isRequired,
	examples: PropTypes.array.isRequired,
	onToggle: PropTypes.func.isRequired,
	onNewProject: PropTypes.func.isRequired,
	onNewPythonProject: PropTypes.func.isRequired,
	onSaveProject: PropTypes.func.isRequired,
	onSaveAsProject: PropTypes.func.isRequired,
	onOpenProject: PropTypes.func.isRequired,
	onReadProject: PropTypes.func.isRequired,
	onSwitchTab: PropTypes.func.isRequired,
};

export default FileMenu;
