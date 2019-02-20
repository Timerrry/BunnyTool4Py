import React, { Component } from 'react';
import { Input, Tooltip } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import EditSpan from '../common/EditSpan';

import styles from './TopBar.scss';

const delay = 0.5;

const TopBar = ({ files, curFileIndex, editingFile, onNewFile, onSaveProject, onSwitchFile, onRenameFile,  onRemoveFile, onUndo, onRedo }) => {
	return (
		<div className={styles.topBar}>
			<Tooltip placement="bottom" title="保存项目" mouseEnterDelay={delay}>
				<span className={classNames(styles.btn, styles.save)} onClick={() => onSaveProject()}>
					<svg className={classNames("timerry-icon", styles.btnIcon)} aria-hidden="true">
						<use xlinkHref="#icon-icon_baocun"></use>
					</svg>
				</span>
			</Tooltip>
			<Tooltip placement="bottom" title="撤消" mouseEnterDelay={delay}>
				<span className={classNames(styles.btn, styles.undo)} onClick={() => onUndo()}>
					<svg className={classNames("timerry-icon", styles.btnIcon)} aria-hidden="true">
						<use xlinkHref="#icon-icon_chexiao"></use>
					</svg>
				</span>
			</Tooltip>
			<Tooltip placement="bottom" title="重做" mouseEnterDelay={delay}>
				<span className={classNames(styles.btn, styles.redo)} onClick={() => onRedo()}>
					<svg className={classNames("timerry-icon", styles.btnIcon)} aria-hidden="true">
						<use xlinkHref="#icon-icon_zhongzuo"></use>
					</svg>
				</span>
			</Tooltip>
			{files.map((file, index) => (
			<div className={styles.fileWrap} key={index} onClick={() => curFileIndex !== index && onSwitchFile(index)}>
				<EditSpan
					value={file.name}
					className={classNames(styles.file, {[styles.fileCurrent]: index === curFileIndex})}
					editingClassName={styles.fileEditing}
					onChange={onRenameFile}
				/>
			</div>
			))}
			<Tooltip placement="bottom" title="新建文件" mouseEnterDelay={delay}>
				<span className={classNames(styles.btn, styles.new)} onClick={() => onNewFile()}>
					<svg className="timerry-icon" aria-hidden="true">
						<use xlinkHref="#icon-icon_guanbidanchuang"></use>
					</svg>
				</span>
			</Tooltip>
			<Tooltip placement="bottom" title="删除文件" mouseEnterDelay={delay}>
				<span className={classNames(styles.btn, styles.remove)} onClick={onRemoveFile}>
					<svg className="timerry-icon" aria-hidden="true">
						<use xlinkHref="#icon-icon_guanbidanchuang"></use>
					</svg>
				</span>
			</Tooltip>
		</div>
	);
}

TopBar.propTypes = {
	files: PropTypes.array.isRequired,
	curFileIndex: PropTypes.number.isRequired,
	onSaveProject: PropTypes.func.isRequired,
	onUndo: PropTypes.func.isRequired,
	onRedo: PropTypes.func.isRequired,
	onSwitchFile: PropTypes.func.isRequired,
	onRenameFile: PropTypes.func.isRequired,
	onNewFile: PropTypes.func.isRequired,
	onRemoveFile: PropTypes.func.isRequired,
};

export default TopBar;
