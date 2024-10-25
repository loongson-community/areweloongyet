import clsx from 'clsx'
import * as _ from 'lodash'

import Link from '@docusaurus/Link'
import { usePluginData } from '@docusaurus/useGlobalData'

import { IProject, IProjectCategory, SupportStatus } from '@site/src/types'
import SupportStatusIcon from '../SupportStatusIcon'
import styles from './styles.module.css'

function Project({val}: {val: IProject}) {
  const distinctSupportStatuses = _.uniq(val.portingEfforts.map((x) => x.supportStatus))
  const statusesToShow = distinctSupportStatuses.length > 0 ? distinctSupportStatuses : [SupportStatus.UpForGrabs]
  const lowestGoodVersion = val.portingEfforts.reduce((prev, x) => {
    return x.goodSinceVersion != '' ? x.goodSinceVersion : prev
  }, '')

  return (
    <li>
      <span>{statusesToShow.map((x, idx) => (<SupportStatusIcon key={idx} val={x} />))}</span>
      <Link to={`/project/${val.code}`} className={styles.project__name}>{val.name}</Link>
      {lowestGoodVersion != '' ? <span className={styles.project__goodSince}> ≥ {lowestGoodVersion}</span> : ''}
    </li>
  )
}

function ProjectList({projects}: {projects: IProject[]}) {
  const sortedProjects = _.clone(projects)
  sortedProjects.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase())
  return (
    <ul className={styles.projects}>
      {sortedProjects.map((x, idx) => (<Project key={idx} val={x} />))}
    </ul>
  )
}

function ProjectCategory({val}: {val: IProjectCategory}) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.category + " padding-horiz--md"}>
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
