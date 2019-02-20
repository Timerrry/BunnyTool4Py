import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Scrollbars } from "react-custom-scrollbars";

import styles from './ComponentList.scss';

const ProjectComponentList = ({ expand, components, current, setScrollbarRef, onRemoveAllComponents, onToggleExpand, onSelectComponent, onRemoveComponent }) => {
  return (
    <div className={classNames(styles.container, {[styles.containerFold]: !expand})}>
      <div className={styles.header}>
        <span className={styles.title}>{components.length > 0 ? `项目器件库(${components.length})` : "项目器件库"}</span>
        <span className={styles.placeholder}></span>
        <span className={classNames(styles.btn, styles.empty)} title="清空" onClick={() => onRemoveAllComponents()}><i className="bunny bunny-empty"></i></span>
        <span className={styles.btn} title={expand ? "折叠" : "展开"} onClick={() => onToggleExpand()}><i className={classNames("bunny", expand ? "bunny-expand-2" : "bunny-fold-2")}></i></span>
      </div>
      { expand ?
      <div className={styles.list}>
        <Scrollbars autoHide ref={setScrollbarRef}>
          {components.map((component,index) => (
          <div key={index} className={classNames(styles.item, {[styles.itemSelected]: current === index})} onClick={() => current !== index && onSelectComponent(index)}>
            <span className={styles.name}>{component.name}</span>
            <span className={styles.placeholder}></span>
            <span className={styles.remove} title="删除" onClick={() => onRemoveComponent(component)}><i className="bunny bunny-delete"></i></span>
          </div>
          ))}
        </Scrollbars>
      </div>
      : null
      }
    </div>
  );
};

ProjectComponentList.propTypes = {
  expand: PropTypes.bool.isRequired,
  components: PropTypes.array.isRequired,
  current: PropTypes.number.isRequired,
  setScrollbarRef: PropTypes.func.isRequired,
  onToggleExpand: PropTypes.func.isRequired,
  onRemoveAllComponents: PropTypes.func.isRequired,
  onRemoveComponent: PropTypes.func.isRequired,
  onSelectComponent: PropTypes.func.isRequired,
};

export default ProjectComponentList;
