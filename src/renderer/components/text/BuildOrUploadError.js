import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { Popover, Button, message } from 'antd';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import classNames from 'classnames';

import styles from './BuildOrUploadError.scss';

class BuildOrUploadError extends Component {
  render() {
    const { error } = this.props;
    if(!error) {
      return null;
    }

    return (
      <Popover
        overlayClassName={styles.container}
        trigger="click"
        title={
          <div className={styles.titleWrap}>
            <span className={styles.title}>错误信息</span>
            <span className={styles.placeholder}></span>
            <CopyToClipboard text={error} onCopy={() => message.info("复制成功")}>
              <Button className={styles.copy} autoFocus>复制</Button>
            </CopyToClipboard>
          </div>
        }
        placement="topLeft"
        content={
          <textarea className={styles.error} defaultValue={error} readOnly></textarea>
        }
      >
        <Button className={styles.expand}>展开错误信息</Button>
      </Popover>
    );
  }
}

BuildOrUploadError.propTypes = {
  error: PropTypes.string,
};

export default BuildOrUploadError;
