import { connect } from 'react-redux';
import Q from 'q';
import PropTypes from 'prop-types';
import LibraryManagerComponent from '../../components/text/LibraryManager';
import React, { Component } from 'react';
import { take, throttle, intersectionBy, orderBy } from 'lodash';
import { message, Modal } from 'antd';
import compareVersions from 'compare-versions';

import { resize, toggle } from '../../reducers/text/libraryManager';
import { setLibraries, updateLibrary } from '../../reducers/text/config';

class LibraryManager extends Component {

  constructor(props) {
    super(props);
    this.state = {
      libraries: [],
      count: 30,
      type: "all",
      category: "all",
      filter: "",
      current: "",
    };

    this._throttleFilterLibraries = throttle(this._filterLibraries, 500);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    Q.all([
      bridge.postMessage("config.loadLibraries"),
      bridge.postMessage("library.list")
    ])
    .then(result => {
      let [ libraries, installed ] = result;
      intersectionBy(libraries, installed, "name").forEach(lib => {
        let installedLib = installed.find(l => l.name === lib.name);
        let configLib = lib.list.find(l => compareVersions(l.version, installedLib.version) === 0);
        if(configLib) {
          lib.installed = true;
          lib.canUpdate = compareVersions(configLib.version, lib.list[0].version) !== 0;
          lib.version = configLib.version;
          lib.examples = installedLib.examples;
        }
      })
      dispatch(setLibraries(libraries));
      this._filterLibraries(libraries);
    });
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.libraries !== this.props.libraries) {
      this._filterLibraries(nextProps.libraries);
    }
  }

  _handleHide() {
    const { dispatch } = this.props;
    dispatch(toggle(false));
  }

  _handleResizeStop(delta) {
    const { dispatch, height } = this.props;
    dispatch(resize(height + delta.height));
  }

  _handleScroll(values) {
    if(values.top < 0.9) {
      return
    }
    const { count, libraries } = this.state;
    if(count >= libraries.length) {
      return
    }
    this.setState({count: count + 30});
  }

  _handleFilterChange(filter) {
    let { libraries } = this.props;
    this.setState({filter}, () => this._throttleFilterLibraries(libraries));
  }

  _handleCategoryChange(category) {
    let { libraries } = this.props;
    this.setState({category}, () => this._filterLibraries(libraries));
  }

  _handleTypeChange(type) {
    let { libraries } = this.props;
    this.setState({type}, () => this._filterLibraries(libraries));
  }

  _handleLibrayInstall(name, version, url, checksum, installed) {
    let self = this;
    let action = installed ? "更新" : "安装";
    bridge.postMessage("url.download", url, checksum)
    .then(
      savePath => {
        bridge.postMessage("library.install", name, savePath)
        .then(
          library => {
            let { libraries, dispatch } = self.props;
            let configLib = libraries.find(l => l.name === name)
            dispatch(updateLibrary({...configLib, installed: true, canUpdate: false, version: version, examples: library.examples}))
            message.success(`${action}库“${name}”成功`);
          },
          () => message.error(`${action}库“${name}”失败`)
        )
      },
      () => message.error(`${action}库“${name}”失败`)
    )
  }

  _handleLibrayRemove(name, version) {
    let self = this;
    Modal.confirm({
			title: '删除库文件',
			content: `确定要删除“${name}-版本${version}”这个库吗？`,
			okText: '确定',
			okType: 'danger',
			cancelText: '取消',
			onOk() {
				bridge.postMessage("library.remove", name)
        .then(() => {
          let { libraries, dispatch } = self.props;
          let library = libraries.find(l => l.name === name)
          dispatch(updateLibrary({...library, installed: false, canUpdate: false, version: "", examples: ""}))
          message.success(`删除成功`);
        })
        .catch(() => message.error(`删除失败`));
			},
		});
  }

  _handleLibraySelect(name) {
    this.setState({current: name});
  }

  _handleLibrayShowExamples(examples) {
    bridge.postMessage("app.showItemInFolder", examples);
  }

  _handleLibrayMore(url) {
    bridge.postMessage("url.open", url);
  }

  _filterLibraries(libraries) {
    let { filter, type, category } = this.state;
    let count = 30;

    filter = filter.toLowerCase();
    libraries = libraries.filter(lib => {
      let library = lib.list[0];
      if(!!filter && filter.length >= 2 && lib.name.toLowerCase().indexOf(filter) < 0 && library.sentence.toLowerCase().indexOf(filter) < 0) {
        return false;
      }

      if(category !== "all" && library.category !== category) {
        return false;
      }

      if(type === "can-update") {
        if(!lib.installed || compareVersions(lib.version, library.version) === 0) {
          return false;
        }
      } else if(type === "installed") {
        if(!lib.installed) {
          return false;
        };
      }
      else if(type !== "all" && library.types.indexOf(type) < 0) {
        return false;
      }
      return true;
    });
    libraries = orderBy(libraries, ["canUpdate", "installed", "name"], ["desc", "desc", "asc"])

    this.setState({libraries, count});
  }

  render() {
    const { visible, height } = this.props;
    const { libraries, current, count, filter, type, category } = this.state;

    return (
      <LibraryManagerComponent
        visible={visible}
        height={height}
        libraries={take(libraries, count)}
        current={current}
        filter={filter}
        type={type}
        category={category}
        onHide={::this._handleHide}
        onResizeStop={::this._handleResizeStop}
        onScroll={::this._handleScroll}
        onFilterChange={::this._handleFilterChange}
        onCategoryChange={::this._handleCategoryChange}
        onTypeChange={::this._handleTypeChange}
        onLibrarySelect={::this._handleLibraySelect}
        onLibraryShowExamples={::this._handleLibrayShowExamples}
        onLibraryInstall={::this._handleLibrayInstall}
        onLibraryRemove={::this._handleLibrayRemove}
        onLibraryMore={::this._handleLibrayMore}
      />
    )
  }
}

LibraryManager.propTypes = {
  visible: PropTypes.bool.isRequired,
  height: PropTypes.number.isRequired,
  libraries: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  visible: state.text.libraryManager.visible,
  height: state.text.libraryManager.height,
  libraries: state.text.config.libraries,
});

export default connect(mapStateToProps)(LibraryManager);
