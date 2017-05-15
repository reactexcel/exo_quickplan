import React from 'react';
import { MdTimelapse } from 'react-icons/lib/md';
import styles from './placeholder.module.scss';

export default function TimelapseBox() {
  return (
    <div className={styles.box} >
      <div className={styles.icon} >
        <MdTimelapse size={80} />
      </div>
    </div>
  );
}
