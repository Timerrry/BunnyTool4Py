import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button, Input, Select, Checkbox } from 'antd';
import { Scrollbars } from "react-custom-scrollbars";

import styles from './ComponentToolbox.scss';

const Search = Input.Search;
const Option = Select.Option;

const ComponentToolbox = ({ search, categories, category, components, current, currentConfig, onSearch, onCategoryChange, onComponentClick, onAddComponent }) => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>元器件</div>
      <div className={styles.search}>
        <Search value={search} placeholder="搜索器件" onChange={e => onSearch(e.target.value)} onSearch={value => onSearch(value)} />
      </div>
      <div className={styles.category}>
        <Select dropdownClassName={styles.dropdown} value={category} onChange={value => onCategoryChange(value)}>
          {categories.map((ca,index) => <Option key={index} value={ca.value}>{ca.label}</Option>)}
        </Select>
      </div>
      <div className={styles.components}>
        <Scrollbars autoHide>
          {components.map((component,index) => (
          <div key={index} className={styles.item}>
            <div className={classNames(styles.header, {[styles.itemSelected]: current && current === component})} onClick={() => onComponentClick(component)}>
              {/* <span className={styles.name}>{component.type ? `${component.name}(${component.type})` : component.name}</span> */}
              <span className={styles.name}>{component.type ? `${component.name}` : component.name}</span>
              <span className={styles.placeholder}></span>
              <span className={styles.add} title="添加" onClick={e => {e.stopPropagation();onAddComponent(component)}}><i className="bunny bunny-add"></i></span>
            </div>
            {current && current === component && currentConfig ?
            <div className={styles.body}>
              <div className={styles.images}>
                <img className={styles.image} src={currentConfig.analogImg} draggable="false" title="设计图" />
                <img className={styles.image} src={currentConfig.physicalImg} draggable="false" title="实物图" />
              </div>
              {currentConfig.tags && currentConfig.tags.length > 0 ?
              <div className={styles.field}>
                <span className={styles.fieldLabel}>标签：</span>
                <span className={styles.fieldValue} title={currentConfig.tags && currentConfig.tags.join("、") || ""}>{currentConfig.tags && currentConfig.tags.join("、") || ""}</span>
                <span className={styles.placeholder}></span>
              </div> : null
              }
              {currentConfig.type ?
              <div className={styles.field}>
                <span className={styles.fieldLabel}>型号：</span>
                <span className={styles.fieldValue} title={currentConfig.type}>{currentConfig.type}</span>
                <span className={styles.placeholder}></span>
              </div> : null
              }
              <div className={styles.field}>
                <span className={styles.fieldLabel}>分类：</span>
                <span className={styles.fieldValue} title={currentConfig.category}>{currentConfig.category}</span>
                <span className={styles.placeholder}></span>
              </div>
              <div className={styles.desc}>
                <span>简介：</span><span>{currentConfig.desc}</span>
              </div>
            </div> : null
            }
          </div>
          ))}
        </Scrollbars>
      </div>
    </div>
  );
};

ComponentToolbox.propTypes = {
  search: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
  category: PropTypes.string.isRequired,
  components: PropTypes.array.isRequired,
  current: PropTypes.object,
  currentConfig: PropTypes.object,
  onSearch: PropTypes.func.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  onComponentClick: PropTypes.func.isRequired,
  onAddComponent: PropTypes.func.isRequired,
}

export default ComponentToolbox;
