import React from 'react';
import clsx from 'clsx';
import {useBaseUrl} from '@docusaurus/useBaseUrl';

import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Physical AI Concepts',
    Svg: require('../../static/img/ai-icon.svg').default,
    description: (
      <>
        Learn the fundamental concepts of Physical AI, bridging the gap between
        digital intelligence and physical interaction in humanoid robotics.
      </>
    ),
  },
  {
    title: 'Simulation First',
    Svg: require('../../static/img/simulation-icon.svg').default,
    description: (
      <>
        Master simulation environments like Gazebo and NVIDIA Isaac Sim before
        deploying to real hardware for safer and more efficient development.
      </>
    ),
  },
  {
    title: 'RAG Integration',
    Svg: require('../../static/img/rag-icon.svg').default,
    description: (
      <>
        Explore Retrieval-Augmented Generation systems that enable robots to
        access and utilize large knowledge bases for enhanced decision making.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={styles.featureCard}>
      <Svg className={styles.featureSvg} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className={styles.featuresContainer}>
        <div className={styles.featureRow}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}