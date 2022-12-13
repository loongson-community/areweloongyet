import React from 'react'

import Layout from '@theme/Layout'

import { IProject } from '@site/src/types'

export default function ProjectPage({data}: {data: IProject}): JSX.Element {
  return (
    <Layout title={`${data.name} | 项目详情`}>
      <main>
        <h2>{data.name}</h2>
        TODO
      </main>
    </Layout>
  );
}
