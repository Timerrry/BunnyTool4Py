import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditSpan from './EditSpan';
import styles from './ProjectName.scss';

const ProjectName = ({ projectName, projectPath, inputStyle, onProjectNameChange }) => {
  return (
    <span className={styles.container} title={projectPath || "未保存"}>
      <EditSpan className={styles.projectName} editingClassName={styles.projectNameEditing} value={projectName} onChange={onProjectNameChange} inputStyle={inputStyle} />
    </span>
  );
}

ProjectName.propTypes = {
  projectName: PropTypes.string.isRequired,
  projectPath: PropTypes.string,
  inputStyle: PropTypes.object,
  onProjectNameChange: PropTypes.func.isRequired,
};

export default ProjectName;
