import React from 'react';
import { MdHelpOutline } from 'react-icons/lib/md';

import styles from './placeholder.module.scss';

export default function PlaceholderBox() {
  return (
    <div className={styles.box} >
      <div className={styles.icon} >
        <MdHelpOutline size={80} />
      </div>
    </div>
  );
}
