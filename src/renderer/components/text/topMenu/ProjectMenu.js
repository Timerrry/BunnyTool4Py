import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import classNames from 'classnames';

import styles from './ProjectMenu.scss';

const delay = 0.5;

const ProjectMenu = ({ active, onExportCode, onToggleLibraryManager, onToggleBoardManager }) => {
  return (
    <div className={classNames(styles.menu, {[styles.active]: active})}>
      <span className={styles.btn} onClick={onExportCode}>
        <span className={styles.btnIcon}>
          <svg className={classNames("timerry-icon", styles.btnIcon)} aria-hidden="true" >
            <use xlinkHref="#icon-icon_daochudaima"></use>
          </svg>
        </span>
        <span className={styles.btnLabel}>导出代码</span>
      </span>
      <span className={styles.btn} onClick={onToggleLibraryManager}>
        <span className={styles.btnIcon}>
          <svg className={classNames("timerry-icon", styles.btnIcon)} aria-hidden="true" >
            <use xlinkHref="#icon-icon_kuguanli"></use>
          </svg>
        </span>
        <span className={styles.btnLabel}>库管理</span>
      </span>
      <span className={styles.btn} onClick={onToggleBoardManager}>
        <span className={styles.btnIcon}>
          <svg className={classNames("timerry-icon", styles.btnIcon)} aria-hidden="true" >
            <use xlinkHref="#icon-icon_kaifabanguanli"></use>
          </svg>
        </span>
        <span className={styles.btnLabel}>开发板管理</span>
      </span>
    </div>
  );
};

ProjectMenu.propTypes = {
	active: PropTypes.bool.isRequired,
	onExportCode: PropTypes.func.isRequired,
	onToggleLibraryManager: PropTypes.func.isRequired,
	onToggleBoardManager: PropTypes.func.isRequired,
};

export default ProjectMenu;
