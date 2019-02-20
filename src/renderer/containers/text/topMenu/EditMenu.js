import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import EditMenuComponent from '../../../components/text/topMenu/EditMenu';
import emitor from '../../../lib/emitor';
import { updateFile, EXT } from '../../../reducers/text/project';

class EditMenu extends Component {

	componentDidMount() {
		emitor.on("app.command.copy", ::this._handleCopy);
		emitor.on("app.command.cut", ::this._handleCut);
		emitor.on("app.command.paste", ::this._handlePaste);
		emitor.on("app.command.selectAll", ::this._handleSelectAll);
	}

	componentWillUnmount() {
		emitor.removeAllListeners("app.command.copy");
		emitor.removeAllListeners("app.command.cut");
		emitor.removeAllListeners("app.command.paste");
		emitor.removeAllListeners("app.command.selectAll");
	}

	_handleCut() {
		this.props.editor.trigger('', 'cut');
	}

	_handleCopy() {
		const { editor } = this.props;
		var model = editor.getModel();
		var selection = editor.getSelection();
		var position = editor.getPosition();
		if(!selection || selection.isEmpty()) {
			var model = editor.getModel();
			var maxLine = model.getLineCount();
			editor.setSelection(new monaco.Range(1, 1, maxLine, model.getLineMaxColumn(maxLine)));
		}
		editor.trigger('source','editor.action.clipboardCopyAction');
		editor.setPosition(position);
		editor.setSelection(selection);
	}

	_handlePaste() {
		this.props.editor.focus();
		document.execCommand('paste');
	}

	_handleToggleComment() {
		this.props.editor.getAction("editor.action.commentLine").run();
	}

	_handleFormatCode() {
		const { editor, language, style, dispatch } = this.props;
		const ext = EXT[language] || "cpp";
		const code = editor.getValue();
		bridge.postMessage("editor.formatCode", code, ext, { style })
		.then(newCode => {
			if(newCode === code) {
				return
			}

			let model = editor.getModel();
			model.pushEditOperations([], [{range: model.getFullModelRange(), text: newCode}]);
		});
	}

	_handleSelectAll() {
		const { editor } = this.props;
		var model = editor.getModel();
		var maxLine = model.getLineCount();
		editor.setSelection(new monaco.Range(1, 1, maxLine, model.getLineMaxColumn(maxLine)));
	}

	_handleFind() {
		this.props.editor.getAction("actions.find").run();
  }

  _handleReplace() {
		this.props.editor.getAction("editor.action.startFindReplaceAction").run();
	}

	render() {
		const { active } = this.props;

		return (
			<EditMenuComponent
				active={active}
				onPaste={::this._handlePaste}
				onCopy={::this._handleCopy}
				onCut={::this._handleCut}
				onToggleComment={::this._handleToggleComment}
				onFormatCode={::this._handleFormatCode}
				onSelectAll={::this._handleSelectAll}
				onFind={::this._handleFind}
        onReplace={::this._handleReplace}
			/>
		);
	}
}

EditMenu.propsType = {
  editor: PropTypes.object,
  language: PropTypes.string.isRequired,
  style: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
	editor: state.text.editor,
	language: state.common.setting.editor.language,
	style: state.common.setting.editor.style,
});

export default connect(mapStateToProps)(EditMenu);
