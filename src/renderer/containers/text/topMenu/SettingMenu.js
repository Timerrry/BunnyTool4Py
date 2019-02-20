import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SettingMenuComponent from '../../../components/text/topMenu/SettingMenu';
import { setTheme, setFontSize, setTabSize, setLineHeight, setStyle } from '../../../reducers/common/setting/editor';
import { toggleShowError } from '../../../reducers/text/config';

class SettingMenu extends Component {

	_handleThemeChange(theme) {
		const { dispatch } = this.props;
		dispatch(setTheme(theme));
	}

	_handleStyleChange(style) {
		const { dispatch } = this.props;
		dispatch(setStyle(style));
	}

	_handleFontSizeChange(fontSize) {
		const { dispatch } = this.props;
		dispatch(setFontSize(fontSize));
	}

	_handleTabSizeChange(tabSize) {
		const { dispatch } = this.props;
		dispatch(setTabSize(tabSize));
	}

	_handleLineHeightChange(lineHeight) {
		const { dispatch } = this.props;
		dispatch(setLineHeight(lineHeight));
	}

	_handleShowErrorChange(showError) {
		const { dispatch } = this.props;
		dispatch(toggleShowError(showError));
	}

	render() {
		const { active, theme, style, fontSize, tabSize, lineHeight, showError } = this.props;

		return (
			<SettingMenuComponent
				active={active}
				theme={theme}
				style={style}
				fontSize={fontSize}
				tabSize={tabSize}
				lineHeight={lineHeight}
				showError={showError}
				onThemeChange={::this._handleThemeChange}
				onStyleChange={::this._handleStyleChange}
				onFontSizeChange={::this._handleFontSizeChange}
				onTabSizeChange={::this._handleTabSizeChange}
				onLineHeightChange={::this._handleLineHeightChange}
				onShowErrorChange={::this._handleShowErrorChange}
			/>
		);
	}
}

SettingMenu.propTypes = {
	active: PropTypes.bool.isRequired,
	theme: PropTypes.string.isRequired,
	style: PropTypes.string.isRequired,
	fontSize: PropTypes.number.isRequired,
	tabSize: PropTypes.number.isRequired,
	lineHeight: PropTypes.number.isRequired,
	showError: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
	theme: state.common.setting.editor.theme,
	style: state.common.setting.editor.style,
	fontSize: state.common.setting.editor.fontSize,
	tabSize: state.common.setting.editor.tabSize,
	lineHeight: state.common.setting.editor.lineHeight,
	showError: state.text.config.showError,
});

export default connect(mapStateToProps)(SettingMenu);
