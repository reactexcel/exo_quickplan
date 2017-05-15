import React from 'react';
import { MdHotel } from 'react-icons/lib/md';

import styles from './placeholder.module.scss';

export default function AccommodationPlaceholder() {
  return (
    <div className={styles.box} >
      <div className={styles.icon}>
        <MdHotel size={80} />
      </div>
    </div>
  );
}
