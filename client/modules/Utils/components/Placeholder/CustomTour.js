import React from 'react';
import { MdConfirmationNumber } from 'react-icons/lib/md';
import styles from './placeholder.module.scss';

export default function CustomTourBox() {
  return (
    <div className={styles.box} >
      <div className={styles.icon} >
        <MdConfirmationNumber size={80} />
      </div>
    </div>
  );
}
