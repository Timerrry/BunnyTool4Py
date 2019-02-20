import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import classNames from 'classnames';

import styles from './EditMenu.scss';

const delay = 0.5;

const EditorMenu = ({ active, onCopy, onCut, onPaste, onToggleComment, onSelectAll, onFind, onReplace, onFormatCode }) => {
  return (
    <div className={classNames(styles.menu, {[styles.active]: active})}>
      <span className={styles.btn} onClick={onCopy}>
        <span className={styles.btnIcon}>
          <svg className={classNames("timerry-icon", styles.btnIcon)} aria-hidden="true" >
            <use xlinkHref="#icon-icon_fuzhi"></use>
          </svg>
        </span>
        <span className={styles.btnLabel}>复制</span>
      </span>
      <span className={styles.btn} onClick={onCut}>
        <span className={styles.btnIcon}>
          <svg className={classNames("timerry-icon", styles.btnIcon)} aria-hidden="true" >
            <use xlinkHref="#icon-icon_jianqie"></use>
          </svg>
        </span>
        <span className={styles.btnLabel}>剪切</span>
      </span>
      <span className={styles.btn} onClick={onPaste}>
        <span className={styles.btnIcon}>
          <svg className={classNames("timerry-icon", styles.btnIcon)} aria-hidden="true" >
            <use xlinkHref="#icon-icon_niantie"></use>
          </svg>
        </span>
        <span className={styles.btnLabel}>粘贴</span>
      </span>
      <span className={styles.divider}></span>
      <span className={styles.btn} onClick={onToggleComment}>
        <span className={styles.btnIcon}>
          <svg className={classNames("timerry-icon", styles.btnIcon)} aria-hidden="true" >
            <use xlinkHref="#icon-icon_zhushi"></use>
          </svg>
        </span>
        <span className={styles.btnLabel}>注释</span>
      </span>
      <span className={styles.btn} onClick={onFormatCode}>
        <span className={styles.btnIcon}>
          <svg className={classNames("timerry-icon", styles.btnIcon)} aria-hidden="true" >
            <use xlinkHref="#icon-icon_geshihua"></use>
          </svg>
        </span>
        <span className={styles.btnLabel}>格式化</span>
      </span>
      <span className={styles.btn} onClick={onSelectAll}>
        <span className={styles.btnIcon}>
          <svg className={classNames("timerry-icon", styles.btnIcon)} aria-hidden="true" >
            <use xlinkHref="#icon-icon_quanxuan"></use>
          </svg>
        </span>
        <span className={styles.btnLabel}>全选</span>
      </span>
      <span className={styles.divider}></span>
      <span className={styles.btn} onClick={onFind}>
        <span className={styles.btnIcon}>
          <svg className={classNames("timerry-icon", styles.btnIcon)} aria-hidden="true" >
            <use xlinkHref="#icon-icon_chazhao"></use>
          </svg>
        </span>
        <span className={styles.btnLabel}>查找</span>
      </span>
      <span className={styles.btn} onClick={onReplace}>
        <span className={styles.btnIcon}>
          <svg className={classNames("timerry-icon", styles.btnIcon)} aria-hidden="true" >
            <use xlinkHref="#icon-icon_tihuan"></use>
          </svg>
        </span>
        <span className={styles.btnLabel}>替换</span>
      </span>
    </div>
  );
}

EditorMenu.propTypes = {
  active: PropTypes.bool.isRequired,
	onPaste: PropTypes.func.isRequired,
	onCopy: PropTypes.func.isRequired,
	onCut: PropTypes.func.isRequired,
	onToggleComment: PropTypes.func.isRequired,
  onFormatCode: PropTypes.func.isRequired,
	onSelectAll: PropTypes.func.isRequired,
  onFind: PropTypes.func.isRequired,
  onReplace: PropTypes.func.isRequired,
};

export default EditorMenu;
