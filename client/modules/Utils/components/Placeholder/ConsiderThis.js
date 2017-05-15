import React from 'react';
import styles from './placeholder.module.scss';

const dotsHorizontal = require('../../../../assets/tpl/images/dots-horizontal.svg');

export default function ConsiderThisBox() {
  return (
    <div className={styles.box} >
      <div className={styles.icon} >
        <div style={{ paddingTop: '20px' }}>
          <img src={dotsHorizontal} role='presentation' className={styles.img} />
        </div>
      </div>
    </div>
  );
}
