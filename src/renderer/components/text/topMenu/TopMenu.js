import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';

import styles from './TopMenu.scss';

const menuStyles = {
	enter: styles.menuEnter,
	enterActive: styles.menuEnterActive,
	exit: styles.menuExit,
  exitActive: styles.menuExitActive,
};

const TopMenu = ({ collapsed, activeMenu, onToggleMenu, children }) => {
	return (
		<div className={styles.wrap}>
			<div className={styles.top}>
				{ children[0] }
				<span className={classNames(styles.item, {[styles.itemCollapsed]: !collapsed && activeMenu === "start"})} onClick={() => onToggleMenu("start")}>开始</span>
				<span className={classNames(styles.item, {[styles.itemCollapsed]: !collapsed && activeMenu === "edit"})} onClick={() => onToggleMenu("edit")}>编辑</span>
				{/* <span className={classNames(styles.item, {[styles.itemCollapsed]: !collapsed && activeMenu === "project"})} onClick={() => onToggleMenu("project")}>项目</span> */}
				<span className={classNames(styles.item, {[styles.itemCollapsed]: !collapsed && activeMenu === "setting"})} onClick={() => onToggleMenu("setting")}>设置</span>
			</div>
			<CSSTransition in={!collapsed} timeout={200} classNames={menuStyles} unmountOnExit>
				<div className={styles.menu}>
					{ children.slice(1) }
				</div>
			</CSSTransition>
		</div>
	);
};

TopMenu.propTypes = {
	collapsed: PropTypes.bool.isRequired,
	activeMenu: PropTypes.string.isRequired,
	onToggleMenu: PropTypes.func.isRequired,
	children: PropTypes.node.isRequired,
};

export default TopMenu;
