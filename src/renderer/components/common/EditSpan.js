import React, { Component } from 'react';
import AutosizeInput from 'react-input-autosize';
import PropTypes from 'prop-types';

class EditSpan extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: undefined,
      active: false,
    };
  }

  _handleClick(e) {
    const { value, doubleClick, onClick, onDoubleClick } = this.props;
    this.setState({value, active: true});
    let handler = doubleClick ? onDoubleClick : onClick;
    handler && handler(e);
  }

  _handleChange(e) {
    this.setState({value: e.target.value});
  }

  _handleFocus(e) {
    e.target.select();
  }

  _handleKeyUp(e) {
    e.keyCode === 13 && this._handleBlur();
  }

  _handleBlur() {
    const { onChange } = this.props;
    const { value } = this.state;
    this.setState({ value: undefined, active: false });
    onChange && value && value !== this.props.value && onChange(value);
  }

  render() {
    const { className, editingClassName, doubleClick, inputStyle } = this.props;
    const { active } = this.state;
    let value = this.state.value !== undefined ? this.state.value : this.props.value;

    if(!active) {
      return doubleClick ? <span className={className} onDoubleClick={::this._handleClick}>{value}</span> : <span className={className} onClick={::this._handleClick}>{value}</span>;
    }

    return (
      <AutosizeInput
        style={{display: "flex", position: "relative"}}
        inputStyle={inputStyle}
        value={value}
        inputClassName={editingClassName}
        onChange={::this._handleChange}
        onFocus={::this._handleFocus}
        onKeyUp={::this._handleKeyUp}
        onBlur={::this._handleBlur}
        autoFocus
      />
    );
  }
}

EditSpan.propTypes = {
  value: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  editingClassName: PropTypes.string.isRequired,
  doubleClick: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  inputStyle: PropTypes.object,
};

EditSpan.defaultProps = {
  value: '',
  className: '',
  editingClassName: '',
  doubleClick: true,
  onChange: () => {},
};

export default EditSpan;
