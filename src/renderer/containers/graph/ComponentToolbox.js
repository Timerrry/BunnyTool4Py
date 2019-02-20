import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { cloneDeep, uniqBy, throttle } from 'lodash';
import update from 'immutability-helper';
import { message } from 'antd';
import { uuid } from '../../lib/util';

import ComponentToolboxComponent from '../../components/graph/ComponentToolbox';

import { addComponent } from '../../reducers/graph/project';

class ComponentToolbox extends Component {

  constructor(props) {
    super(props);
    let { allComponents } = props;
    let categories = uniqBy(allComponents, "category").map(component => ({label: component.category, value: component.category}));
    categories = [{label: "全部", value: "all"}, {label: "已添加", value: "added"}, ...categories];
    this.state = {
      search: "",
      displayComponents: allComponents,
      categories: categories,
      category: "all",
      current: null,
    };

    this._throttleFilterComponents = throttle(this._filterComponents.bind(this), 500);
  }

  componentDidUpdate(prevProps) {
    if(prevProps.allComponents !== this.props.allComponents) {
      let { allComponents } = this.props;
      let categories = uniqBy(allComponents, "category").map(component => ({label: component.category, value: component.category}));
      categories = [{label: "全部", value: "all"}, {label: "已添加", value: "added"}, ...categories];
      this.setState({
        categories: categories,
        category: "all",
      }, () => this._filterComponents(allComponents));
    }
    if(prevProps.addedComponents !== this.props.addedComponents) {
      let { category } = this.state;
      if(category === "added") {
        let { allComponents } = this.props;
        this._filterComponents(allComponents);
      }
    }
  }

  _handleSearch(search) {
    let { allComponents } = this.props;
    this.setState({search}, () => this._throttleFilterComponents(allComponents));
  }

  _handleCategoryChange(category) {
    let { allComponents } = this.props;
    this.setState({category}, () => this._throttleFilterComponents(allComponents));
  }

  _handleAddComponent(component) {
    if(!component.blocks || component.blocks.length === 0) {
      message.info("敬请期待");
      return;
    }

    const { dispatch, addedComponents } = this.props;
    let name = this._getComponentInstanceName(component, addedComponents.filter(c => c.id === component.id));
    let instance = { id: component.id, uid: uuid(), name: name };
    dispatch(addComponent(instance));
  }

  _handleComponentClick(component) {
    let { current } = this.state;
    if(current === component) {
      this.setState({current: null, currentConfig: null});
    } else {
      let { allComponents } = this.props;
      let currentConfig = allComponents.find(c => c.id === component.id);
      this.setState({current: component, currentConfig});
    }
  }

  _filterComponents(components) {
    let { search, category } = this.state;
    const { addedComponents } = this.props;

    search = search.toLowerCase();
    components = components.filter(component => {
      if(!!search && search.length >= 2 && (!component.type || component.type.toLowerCase().indexOf(search) < 0) && component.name.toLowerCase().indexOf(search) < 0 && !component.tags.find(tag => tag.toLowerCase().indexOf(search) >= 0) && component.desc.toLowerCase().indexOf(search) < 0) {
        return false;
      }

      if(category === "added") {
        return !!addedComponents.find(c => c.id === component.id);
      }
      else if (category !== "all") {
        return component.category === category;
      }

      return true;
    });

    this.setState({ displayComponents: components });
  }

  _getComponentInstanceName(component, existInstances) {
    let name;
    let index = 1;
    while(true) {
      name = `${component.name}-${index}`;
      if(!existInstances.find(c => c.name === name)) {
        break;
      }
      index++;
    }
    return name;
  }

  render() {
    const { search, category, categories, displayComponents, current, currentConfig } = this.state;

    return (
      <ComponentToolboxComponent
        search={search}
        categories={categories}
        category={category}
        components={displayComponents}
        current={current}
        currentConfig={currentConfig}
        onSearch={::this._handleSearch}
        onCategoryChange={::this._handleCategoryChange}
        onComponentClick={::this._handleComponentClick}
        onAddComponent={::this._handleAddComponent}
      />
    )
  }
}

ComponentToolbox.propTypes = {
  allComponents: PropTypes.array.isRequired,
  addedComponents: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  allComponents: state.graph.config.components,
  addedComponents: state.graph.project.components,
});

export default connect(mapStateToProps)(ComponentToolbox);
