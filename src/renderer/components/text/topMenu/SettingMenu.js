import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Switch } from 'antd';
import classNames from 'classnames';
import { range } from 'lodash';

const Option = Select.Option;

import styles from './SettingMenu.scss';

const SettingMenu = ({ active, theme, style, fontSize, tabSize, lineHeight, showError, onThemeChange, onStyleChange, onFontSizeChange, onTabSizeChange, onLineHeightChange, onShowErrorChange }) => {
	return (
		<div className={classNames(styles.menu, {[styles.active]: active})}>
			<span className={styles.label}>代码颜色：</span>
			<Select className={styles.select} value={theme} onChange={onThemeChange}>
				<Option value="vs-dark">深色</Option>
				<Option value="vs">浅色</Option>
			</Select>
			<span className={styles.label}>代码风格：</span>
			<Select className={styles.select} dropdownClassName="aaa" value={style} onChange={onStyleChange}>
				<Option value="Google">Google</Option>
				<Option value="LLVM">LLVM</Option>
				<Option value="Chromium">Chromium</Option>
				<Option value="WebKit">WebKit</Option>
			</Select>
			<span className={styles.label}>字体大小：</span>
			<Select className={classNames(styles.select, styles.fontSize)} value={fontSize} onChange={onFontSizeChange}>
			{range(12, 29).map((value,index) => <Option key={index} value={value}>{value}px</Option>)}
			</Select>
			<span className={styles.label}>字体行高：</span>
			<Select className={classNames(styles.select, styles.lineHeight)} value={lineHeight} onChange={onLineHeightChange}>
			{range(12, 31).map((value,index) => <Option key={index} value={value}>{value}px</Option>)}
			</Select>
			<span className={styles.label}>Tab大小：</span>
			<Select className={styles.select} value={tabSize} onChange={onTabSizeChange}>
				<Option value="0">0</Option>
				<Option value="2">2</Option>
				<Option value="4">4</Option>
				<Option value="8">8</Option>
			</Select>
			<span className={styles.label}>错误信息：</span>
			<Switch className={styles.switch} checked={showError} onChange={onShowErrorChange} />
		</div>
	);
};

SettingMenu.propTypes = {
	active: PropTypes.bool.isRequired,
	theme: PropTypes.string.isRequired,
	style: PropTypes.string.isRequired,
	fontSize: PropTypes.number.isRequired,
	tabSize: PropTypes.number.isRequired,
	lineHeight: PropTypes.number.isRequired,
	showError: PropTypes.bool.isRequired,
	onThemeChange: PropTypes.func.isRequired,
	onStyleChange: PropTypes.func.isRequired,
	onFontSizeChange: PropTypes.func.isRequired,
	onTabSizeChange: PropTypes.func.isRequired,
	onLineHeightChange: PropTypes.func.isRequired,
	onShowErrorChange: PropTypes.func.isRequired,
};

export default SettingMenu;
