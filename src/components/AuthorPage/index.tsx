import React from 'react'

import Layout from '@theme/Layout'

import { EntityKind, IAuthor } from '@site/src/types'

function renderKind(k: EntityKind): JSX.Element {
  switch (k) {
  case EntityKind.Community:
    return (<li><span>利益无关：社区贡献者</span></li>)
  case EntityKind.Corporate:
    return (<li><span>利益相关：龙芯生态企业</span></li>)
  case EntityKind.Loongson:
    return (<li><span>利益相关：龙芯员工</span></li>)
  }
}

export default function AuthorPage({data}: {data: IAuthor}): JSX.Element {
  return (
    <Layout title={`${data.name} | 移植者详情`}>
      <main>
        <h2>{data.name}</h2>
        <ul>
          {renderKind(data.kind)}
          {data.url != ''
            ? <li>网站: <a href={data.url}>{data.url}</a></li>
            : ''}
          {data.githubUsername != ''
            ? <li>GitHub: <a href={`https://github.com/${data.githubUsername}`}>@{data.githubUsername}</a></li>
            : ''}
          {data.giteeUsername != ''
            ? <li>Gitee: <a href={`https://gitee.com/${data.githubUsername}`}>@{data.giteeUsername}</a></li>
            : ''}
        </ul>
      </main>
    </Layout>
  );
}
