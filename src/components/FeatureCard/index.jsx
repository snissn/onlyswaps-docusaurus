import React from 'react';
import styles from './styles.module.css';

export default function FeatureCard({ 
  title, 
  description, 
  href,
  icon, 
  iconAlt,
  external = false
}) {
  const CardWrapper = href ? 'a' : 'div';
  const cardProps = href ? {
    href,
    target: external ? "_blank" : undefined,
    rel: external ? "noopener noreferrer" : undefined,
    className: styles.cardLink
  } : {};

  return (
    <CardWrapper {...cardProps} className={styles.card}>
      <div className={styles.cardHeader}>
        {icon && (
          <img 
            src={icon} 
            alt={iconAlt || title} 
            className={styles.cardImage} 
          />
        )}
        <h3 className={styles.cardTitle}>{title}</h3>
      </div>
      <div className={styles.cardBody}>
        <p className={styles.cardDescription}>{description}</p>
        <div className={styles.cardAction}>
          <span className={styles.cardActionText}>
            {external ? 'Learn more →' : 'Get started →'}
          </span>
        </div>
      </div>
    </CardWrapper>
  );
}
