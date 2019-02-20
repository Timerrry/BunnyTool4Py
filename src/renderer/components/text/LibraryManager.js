import React, { Component } from 'react';
import Resizable from "re-resizable";
import { CSSTransition } from 'react-transition-group';
import { Scrollbars } from "react-custom-scrollbars";
import { Input, Select, Button } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
const { Option } = Select;

import styles from './LibraryManager.scss';
import LibraryItem from './LibraryItem';

const animationStyles = {
	enter: styles.enter,
	enterActive: styles.enterActive,
	exit: styles.exit,
  exitActive: styles.exitActive,
};

const LibraryManager = ({ visible, height, libraries, current, filter, type, category, onHide, onResizeStop, onScroll, onFilterChange, onCategoryChange, onTypeChange, onLibrarySelect, onLibraryShowExamples, onLibraryInstall, onLibraryRemove, onLibraryMore }) => {
  return (
    <CSSTransition in={visible} timeout={300} classNames={animationStyles} unmountOnExit>
      <Resizable className={styles.container} defaultSize={{height: height || styles.height}} enable={{top: true}} handleStyles={{top: {cursor: 'n-resize'}}} onResizeStop={(e, dir, ref, delta) => onResizeStop(delta)}>
        <div className={styles.containerWrap}>
          <div className={styles.header}>
            <span className={styles.title}>库管理</span>
            <span className={styles.placeholder}></span>
            <span className={styles.close} onClick={onHide}><i className="bunny bunny-close"></i></span>
          </div>
          <div className={styles.content}>
            <div className={styles.libraries}>
              <Scrollbars onScrollFrame={onScroll} autoHide>
              {libraries.map((lib,index) => <LibraryItem key={index} lib={lib} active={current === lib.name} onSelect={onLibrarySelect} onShowExamples={onLibraryShowExamples} onInstall={onLibraryInstall} onRemove={onLibraryRemove} onMore={onLibraryMore} />)}
              </Scrollbars>
            </div>
            <div className={styles.footer}>
              <span className={styles.placeholder}></span>
              <Input className={styles.filter} placeholder="关键词过滤..." autoFocus value={filter} onChange={e => onFilterChange(e.target.value)} />
              <span className={styles.categoryLabel}>主题</span>
              <Select className={classNames(styles.select, styles.categories)} value={category} onChange={onCategoryChange}>
                <Option value="all">全部</Option>
                <Option value="Communication">通信</Option>
                <Option value="Data Processing">数据处理</Option>
                <Option value="Data Storage">数据存储</Option>
                <Option value="Device Control">设备控制</Option>
                <Option value="Display">显示</Option>
                <Option value="Other">其它</Option>
                <Option value="Sensors">传感器</Option>
                <Option value="Signal Input/Output">信号输入/输出</Option>
                <Option value="Timing">计时</Option>
                <Option value="Uncategorized">未分类</Option>
              </Select>
              <span className={styles.typeLabel}>类型</span>
              <Select className={classNames(styles.select, styles.types)} value={type} onChange={onTypeChange}>
                <Option value="all">全部</Option>
                <Option value="can-update">可更新</Option>
                <Option value="installed">已安装</Option>
                <Option value="Arduino">Arduino</Option>
                <Option value="Timerry">时忆</Option>
                <Option value="Partner">合作伙伴</Option>
                <Option value="Recommended">推荐</Option>
                <Option value="Contributed">贡献</Option>
                <Option value="Retired">已废弃</Option>
              </Select>
            </div>
          </div>
        </div>
      </Resizable>
    </CSSTransition>
  );
};

LibraryManager.propTypes = {
  visible: PropTypes.bool.isRequired,
  height: PropTypes.number.isRequired,
  libraries: PropTypes.array.isRequired,
  current: PropTypes.string.isRequired,
  filter: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired,
  onResizeStop: PropTypes.func.isRequired,
  onScroll: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  onTypeChange: PropTypes.func.isRequired,
  onLibrarySelect: PropTypes.func.isRequired,
  onLibraryShowExamples: PropTypes.func.isRequired,
  onLibraryInstall: PropTypes.func.isRequired,
  onLibraryRemove: PropTypes.func.isRequired,
  onLibraryMore: PropTypes.func.isRequired,
};

export default LibraryManager;
