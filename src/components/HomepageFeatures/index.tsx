import React from 'react'
import clsx from 'clsx'
import { projectCategories, projects } from '../../data'
import { IProject, IProjectCategory } from '../../types'
import SupportStatusIcon from '../SupportStatusIcon'
import styles from './styles.module.css'

function Project({val}: {val: IProject}) {
  return (
    <p>
      {val.name}
      {val.portingEfforts.map((pe) => (<SupportStatusIcon val={pe.supportStatus} />))}
    </p>
  )
}

function ProjectList({projectCodes}: {projectCodes: string[]}) {
  return (
    <ul>
      {projectCodes.map((x) => {
        const proj = projects[x]
        return (
        <li><Project val={proj} /></li>
      )})}
    </ul>
  )
}

function ProjectCategory({val}: {val: IProjectCategory}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <h3>{val.name}</h3>
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
