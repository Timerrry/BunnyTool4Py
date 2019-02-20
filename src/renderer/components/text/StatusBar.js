import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { Menu, Dropdown } from 'antd';
import classNames from 'classnames';

import BuildOrUploadError from './BuildOrUploadError';
import styles from './StatusBar.scss';

const MenuItem = Menu.Item;

const StatusBar = ({ message, hasSave, updatedAt, buildMessage, buildError, onHelpMenuClick }) => {
	const helpMenu = (
		<Menu className={styles.menu} onClick={({key}) => onHelpMenuClick(key)}>
			<MenuItem key="switch-graph" className={styles.menuItem} title="切到图形版">图形版</MenuItem>
			<MenuItem key="install-driver" className={styles.menuItem} title="修复驱动">修复驱动</MenuItem>
			<MenuItem key="check-update" className={styles.menuItem} title="软件升级">升级</MenuItem>
			<MenuItem key="office-web" className={styles.menuItem} title="访问官网">官网</MenuItem>
			<MenuItem key="suggest" className={styles.menuItem} title="建议反馈">反馈</MenuItem>
			<MenuItem key="about" className={styles.menuItem} title="关于软件">关于</MenuItem>
		</Menu>
	);

	return (
		<div className={styles.statusBar}>
			<span className={styles.message}>{hasSave ? `已保存` : "未保存"}</span>
			{hasSave ? <span className={styles.time}><Moment fromNow unix>{updatedAt}</Moment></span> : null}
			{buildMessage ? <span className={styles.message}>{buildMessage}</span> : null}
			<BuildOrUploadError error={buildError} />
			<span className={styles.placeholder}></span>
			<Dropdown overlay={helpMenu} trigger={['click']} placement="topRight">
				<span className={styles.help}>帮助</span>
			</Dropdown>
		</div>
	);
};

StatusBar.propTypes = {
	message: PropTypes.string.isRequired,
	hasSave: PropTypes.bool.isRequired,
	updatedAt: PropTypes.number.isRequired,
	buildMessage: PropTypes.string.isRequired,
	onHelpMenuClick: PropTypes.func.isRequired,
	buildError: PropTypes.string,
};

export default StatusBar;
