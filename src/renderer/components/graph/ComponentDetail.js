import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Scrollbars } from "react-custom-scrollbars";
import ComponentProperty from './ComponentProperty';
import styles from './ComponentDetail.scss';

const ComponentDetail = ({ component, componentConfig, active, onPropertyChange, onSwitchTab }) => {
  return (
    <div className={classNames(styles.container, {[styles.containerActive]: active})}>
      <div className={styles.title}>
        <span className={classNames(styles.tabTitle, styles.tabTitleActive)}>元件规格</span>
        <span className={styles.tabTitle} onClick={() => onSwitchTab("code-view")}>代码</span>
      </div>
      {component && componentConfig ?
      <div className={styles.content}>
        <div className={styles.top}>
          <span className={styles.name}>{component.name}</span>
          <div className={classNames(styles.tagsWrap, {[styles.noTags]: !componentConfig.tags || componentConfig.tags.length === 0})}>
            <span className={styles.tagsLabel}>标签：</span>
            <span className={styles.tags} title={componentConfig.tags && componentConfig.tags.join("、") || ""}>{componentConfig.tags && componentConfig.tags.join("、") || ""}</span>
            <span className={styles.placeholder}></span>
          </div>
          <div className={styles.images}>
            <img className={styles.image} src={componentConfig.analogImg} draggable="false" title="设计图" />
            <img className={styles.image} src={componentConfig.physicalImg} draggable="false" title="实物图" />
          </div>
          <div className={styles.rest}>
            <Scrollbars autoHide>
              <div className={styles.list}>
                {componentConfig.type ?
                <div className={styles.item}>
                  <span className={styles.itemLabel}>型号：</span>
                  <span className={styles.itemValue} title={componentConfig.type}>{componentConfig.type}</span>
                  <span className={styles.placeholder}></span>
                </div> : null
                }
                <div className={styles.item}>
                  <span className={styles.itemLabel}>分类：</span>
                  <span className={styles.itemValue} title={componentConfig.category}>{componentConfig.category}</span>
                  <span className={styles.placeholder}></span>
                </div>
                {componentConfig.details && componentConfig.details.map((detail,index) => (
                <div key={index} className={styles.item}>
                  <span className={styles.itemLabel}>{detail.label}：</span>
                  <span className={styles.itemValue} title={detail.value}>{detail.value}</span>
                  <span className={styles.placeholder}></span>
                </div>
                ))
                }
                <div className={styles.desc}>
                  <span>简介：</span><span>{componentConfig.desc}</span>
                </div>
              </div>
            </Scrollbars>
          </div>
        </div>
        {componentConfig.properties ?
        <div className={styles.bottom}>
          <div className={styles.header}>属性设置</div>
          <div className={styles.body}>
            <Scrollbars autoHide>
              <div className={styles.list}>
                {componentConfig.properties.map((property,index) => <ComponentProperty key={index} property={property} value={component.property && component.property[property.name]} onChange={value => onPropertyChange(property, value)} />)}
              </div>
            </Scrollbars>
          </div>
        </div>: null
        }
      </div>
      :
      <div className={styles.content}>
        <div className={styles.noComponent}>请从左下方“项目器件库”中<br />选择器件并进行设置</div>
      </div>
      }
    </div>
  );
};

ComponentDetail.propTypes = {
  component: PropTypes.object,
  componentConfig: PropTypes.object,
  active: PropTypes.bool.isRequired,
  onPropertyChange: PropTypes.func.isRequired,
  onSwitchTab: PropTypes.func.isRequired,
};

export default ComponentDetail;
