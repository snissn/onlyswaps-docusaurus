import React from 'react';
import styles from './styles.module.css';

export default function FeatureCardGrid({ children }) {
  return (
    <div className={styles.cardGrid}>
      {children}
    </div>
  );
}
