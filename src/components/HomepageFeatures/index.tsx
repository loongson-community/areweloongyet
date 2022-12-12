import React from 'react'
import clsx from 'clsx'
import { projectCategories, projects } from '../../data'
import { IProject, IProjectCategory } from '../../types'
import SupportStatusIcon from '../SupportStatusIcon'
import styles from './styles.module.css'

function Project({val}: {val: IProject}) {
  const lowestGoodVersion = val.portingEfforts.reduce((prev, x) => {
    return x.goodSinceVersion != '' ? x.goodSinceVersion : prev
  }, '')

  return (
    <li className={clsx('col col--6')}>
      <span>{val.portingEfforts.map((pe) => (<SupportStatusIcon val={pe.supportStatus} />))}</span>
      <span>{val.name}</span>
      {lowestGoodVersion != '' ? <span className={styles.project__goodSince}> ≥ {lowestGoodVersion}</span> : ''}
    </li>
  )
}

function ProjectList({projectCodes}: {projectCodes: string[]}) {
  return (
    <ul className={styles.projects}>
      {projectCodes.map((x) => {
        const proj = projects[x]
        return (
        <Project val={proj} />
      )})}
    </ul>
  )
}

function ProjectCategory({val}: {val: IProjectCategory}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <h2 className={styles.category__title}>{val.name}</h2>
        <ProjectList projectCodes={val.projects} />
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {projectCategories.map((pc, idx) => (
            <ProjectCategory key={idx} val={pc} />
          ))}
        </div>
      </div>
    </section>
  );
}
