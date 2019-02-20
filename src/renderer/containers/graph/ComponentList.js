import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal, message } from 'antd';

import ComponentListComponent from '../../components/graph/ComponentList';

import { removeComponent, removeAllComponents, selectComponent } from '../../reducers/graph/project';
import { toggleListExpand } from '../../reducers/graph/view';

class ComponentList extends Component {

  componentDidUpdate(prevProps) {
    if(this.props.components.length > prevProps.components.length) {
      this.scrollbar && this.scrollbar.scrollToBottom();
    }
  }

  _handleToggleExpand() {
    const { dispatch } = this.props;
    dispatch(toggleListExpand());
  }

  _handleRemoveComponent(component) {
    const { dispatch } = this.props;
    dispatch(removeComponent(component));
  }

  _handleRemoveAllComponents() {
    const { dispatch } = this.props;
    Modal.confirm({
			title: '删除项目器件',
			content: `确定要删除项目所有器件吗？`,
			okText: '确定',
			okType: 'danger',
			cancelText: '取消',
			onOk() {
				dispatch(removeAllComponents());
			},
    });
  }

  _handleSelectComponent(index) {
    const { dispatch } = this.props;
    dispatch(selectComponent(index));
  }

  _setScrollbarRef(ref) {
    this.scrollbar = ref;
  }

  render() {
    const { components, current, expand } = this.props;

    return (
      <ComponentListComponent
        expand={expand}
        components={components}
        current={current}
        setScrollbarRef={::this._setScrollbarRef}
        onRemoveAllComponents={::this._handleRemoveAllComponents}
        onToggleExpand={::this._handleToggleExpand}
        onRemoveComponent={::this._handleRemoveComponent}
        onSelectComponent={::this._handleSelectComponent}
      />
    )
  }
}

ComponentList.propTypes = {
  componentConfigs: PropTypes.array.isRequired,
  components: PropTypes.array.isRequired,
  current: PropTypes.number.isRequired,
  expand: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  componentConfigs: state.graph.config.components,
  components: state.graph.project.components,
  current: state.graph.project.index,
  expand: state.graph.view.listExpand,
});

export default connect(mapStateToProps)(ComponentList);
