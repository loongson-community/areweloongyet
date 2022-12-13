import React from 'react'
import clsx from 'clsx'

import Link from '@docusaurus/Link'
import { usePluginData } from '@docusaurus/useGlobalData'

import { IProject, IProjectCategory } from '@site/src/types'
import SupportStatusIcon from '../SupportStatusIcon'
import styles from './styles.module.css'

function Project({val}: {val: IProject}) {
  const lowestGoodVersion = val.portingEfforts.reduce((prev, x) => {
    return x.goodSinceVersion != '' ? x.goodSinceVersion : prev
  }, '')

  return (
    <li className={clsx('col col--6')}>
      <span>{val.portingEfforts.map((pe) => (<SupportStatusIcon val={pe.supportStatus} />))}</span>
      <Link to={`/project/${val.code}`}>{val.name}</Link>
      {lowestGoodVersion != '' ? <span className={styles.project__goodSince}> ≥ {lowestGoodVersion}</span> : ''}
    </li>
  )
}

function ProjectList({projects}: {projects: IProject[]}) {
  return (
    <ul className={styles.projects}>
      {projects.map((x) => (<Project val={x} />))}
    </ul>
  )
}

function ProjectCategory({val}: {val: IProjectCategory}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <h2 className={styles.category__title}>{val.name}</h2>
        <ProjectList projects={val.projects} />
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  const categories = usePluginData('awly-data-plugin') as IProjectCategory[]
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {categories.map((pc, idx) => (
            <ProjectCategory key={idx} val={pc} />
          ))}
        </div>
      </div>
    </section>
  );
}
