import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu, Dropdown } from 'antd';
import styles from './Help.scss';

const Prompt = ({ onMenuClick }) => {
  return (
    <Dropdown
      trigger={['click']}
      placement="topCenter"
      overlay={
        <Menu className={styles.menu} onClick={({key}) => onMenuClick(key)}>
          <MenuItem key="switch-text" className={styles.menuItem} title="切到文本版">文本版</MenuItem>
          <MenuItem key="install-driver" className={styles.menuItem} title="修复驱动">驱动</MenuItem>
          <MenuItem key="check-update" className={styles.menuItem} title="软件升级">升级</MenuItem>
          <MenuItem key="office-web" className={styles.menuItem} title="访问官网">官网</MenuItem>
          <MenuItem key="suggest" className={styles.menuItem} title="反馈建议">反馈</MenuItem>
          <MenuItem key="about" className={styles.menuItem} title="关于软件">关于</MenuItem>
        </Menu>
      }
    >
			<span className={styles.icon}><i className="bunny bunny-translation"></i></span>
		</Dropdown>
  );
};

Prompt.propTypes = {
  message: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  callback: PropTypes.func.isRequired,
};

PropTypes.defaultProps = {
  message: "提示",
  defaultValue: "",
  callback: () => {},
};

Prompt.show =

export default Prompt;
