import React, { Component } from 'react';
import { Select, Button } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
const { Option } = Select;

import styles from './LibraryItem.scss';

const LibraryItem = ({ lib, active, onSelect, onShowExamples, onInstall, onRemove, onMore }) => {
  const { name, list, installed, canUpdate, examples, version } = lib;
  let library = installed ? list.find(l => l.version === version) : list[0];
  let author = library.author.replace(/ ?<[^>]+>/g, "");
  let installLib = list[0];

  return (
    <div className={classNames(styles.item, {[styles.itemActive]: active})} tabIndex={-1} onClick={e => {e.stopPropagation(); onSelect(name);}}>
      <div className={styles.top}>
        <span className={styles.name}>{name}</span>
        <span className={styles.by}>by</span>
        <span className={styles.author} title={author}>{author}</span>
        <span className={styles.placeholder}></span>
        {examples ? <Button className={styles.examples} onClick={() => onShowExamples(examples)}>示例</Button> : null}
      </div>
      <div>
        <span className={styles.sentence}>{library.sentence}</span>
      </div>
      <div className={styles.footer}>
        <span className={styles.more} onClick={() => onMore(library.website)}>更多信息</span>
        <span className={styles.version}>版本 {library.version}</span>
        <span className={styles.placeholder}></span>
        <div className={styles.installWrap}>
          {installed ? <Button className={styles.remove} onClick={() => onRemove(library.name, library.version)}>删除</Button> : null}
          {!installed || canUpdate ? <Button className={styles.install} onClick={() => onInstall(installLib.name, installLib.version, installLib.url, installLib.checksum, installed)}>{installed ? "更新" : "安装"}</Button> : null}
        </div>
      </div>
    </div>
  );
}

LibraryItem.propTypes = {
  lib: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onShowExamples: PropTypes.func.isRequired,
  onInstall: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onMore: PropTypes.func.isRequired,
};

export default LibraryItem;
