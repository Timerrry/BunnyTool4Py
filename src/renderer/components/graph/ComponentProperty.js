import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Input, Select, } from 'antd';

import styles from './ComponentProperty.scss';

const Option = Select.Option;

const ComponentProperty = ({ value, property, onChange }) => {
  let { name, label, type, defaultValue } = property;
  let props;
  value = value !== undefined ? value : defaultValue;
  if(type === "select") {
    props = { value: `${value || ""}`, onChange: value => onChange(value) };
    return (
      <div className={styles.container}>
        <span className={styles.label} title={name}>{label}:</span>
        <Select className={styles.value} dropdownClassName={styles.dropdown} title={name} {...props}>
        {property.options && property.options.map((option,index) => <Option key={index} value={option.value} title={option.value}>{option.label}</Option>)}
        </Select>
      </div>
    );
  }

  if(type === "bool") {
    props = { checked: !!value, onChange: value => onChange(value) };
    return (
      <div className={styles.container}>
        <span className={styles.label} title={name}>{label}:</span>
        <Switch {...props} />
      </div>
    );
  }

  props = { value, onChange: e => onChange(e.target.value) };
  return (
    <div className={styles.container}>
      <span className={styles.label} title={name}>{label}:</span>
      <Input className={styles.value} title={name} placeholder={property.placeholder} {...props} />
    </div>
  )
};

ComponentProperty.propTypes = {
  property: PropTypes.object.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default ComponentProperty;
