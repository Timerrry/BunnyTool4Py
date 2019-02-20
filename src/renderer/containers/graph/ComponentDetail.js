import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { updateComponent } from '../../reducers/graph/project';
import { switchRightTab } from '../../reducers/graph/view';

import ComponentDetailComponent from '../../components/graph/ComponentDetail';

class ComponentDetail extends Component {

  _handelPropertyChange(property, value) {
    const { dispatch, index, components, componentConfigs } = this.props;
    let component = components[index];
    dispatch(updateComponent(component.uid, {property: {...component.property, [property.name]: value}}));
  }

  _handelSwitchTab(tab) {
    const { dispatch } = this.props;
    dispatch(switchRightTab(tab));
  }

  render() {
    const { index, components, componentConfigs, active } = this.props;
    let component = index >= 0 ? components[index] : null;
    let componentConfig = component ? componentConfigs.find(config => config.id === component.id) : null;

    return (
      <ComponentDetailComponent
        component={component}
        componentConfig={componentConfig}
        active={active}
        onPropertyChange={::this._handelPropertyChange}
        onSwitchTab={::this._handelSwitchTab}
      />
    )
  }
}

ComponentDetail.propTypes = {
  index: PropTypes.number.isRequired,
  components: PropTypes.array.isRequired,
  componentConfigs: PropTypes.array.isRequired,
  active: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  index: state.graph.project.index,
  components: state.graph.project.components,
  componentConfigs: state.graph.config.components,
  active: state.graph.view.rightTab.tab === "component-detail",
});

export default connect(mapStateToProps)(ComponentDetail);
