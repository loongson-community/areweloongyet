export enum SupportStatus {
  // 支持状态未知，需核实
  // Unknown support status, need manual confirmation
  Unknown,
  // 移植被拒绝（非技术因素：商业/政治等）
  // Port was rejected because of non-technical reasons (commercial, politics,
  // etc.)
  Rejected,
  // 支持了，但仅有闭源/商业支持
  // 代码不可获得，甚至 blob 也不一定可获得（在必须签订合同的情况下）
  // Supported, but closed-source-only, or even only under commercial
  // contracts.
  // Source code is unavailable. Even binary blobs could be unavailable except
  // after signing contracts.
  CommercialOnly,
  // 受阻
  // 由于移植被技术因素拒绝，或贡献者人间蒸发等其他原因，需要重启工作
  // Stalled
  // Work has to be restarted, either because a previous port was rejected
  // because of technical reasons, or the contributor(s) of a WIP port has
  // disappeared from Internet, or some other reasons.
  Stalled,
  // 没人做
  // No one has stepped up yet
  UpForGrabs,
  // 施工中：有人开始做了，但没做完
  // Work-in-progress: Someone has stepped up to the work but hasn't finished
  // yet
  WIP,
  // 正接受上游代码审查
  // Undergoing code review from upstream
  UnderReview,
  // 已经合入上游，等正式版本发布（如 Git tag 等）
  // Merged into upstream, awaiting an official release (Git tags etc.)
  WaitingRelease,
  // 已在正式版本发布（如 Git tag 等）
  // Officially released (in a Git tag etc.)
  Released,
}

export enum EntityKind {
  // 与龙芯无关的实体
  // Entities unaffiliated with Loongson
  Community,
  // 与龙芯利益相关的实体，如其合作伙伴、生态圈企业等
  // Entities affiliated with Loongson, e.g. business partners or corporations
  // participating in the "Loongson ecosystem"
  Corporate,
  // 龙芯公司自身，或以龙芯员工身份活动的个人
  // The Loongson Corporation itself, or its employees acting in such capacity
  Loongson,
}

export enum CodeQuality {
  // 不涉及代码，或代码不可见
  // No code is involved / code is unavailable
  NoCode,
  // 符合上游质量标准
  // On par with upstream quality standards
  OnPar,
  // 整体架构按上游标准可行，但代码风格、提交说明措辞等细节上需要清理、规范
  // Overall architecture is feasible upstream but details need cleanup, such
  // as code style or commit message wording
  NeedsCleanup,
  // 由于架构差异、设计决策等深层原因，毫无希望上游，需要重做
  // 如果上述条件成立，即使一个项目的代码质量优良，也应归为此类。
  // No hope of seeing this upstreamed because of deep-reaching reasons, such
  // as architectural differences or design choices; full rework is needed
  // This category should be chosen for a project even if the code quality is
  // good, as long as the defining criteria is satisfied.
  NeedsRework,
}

export type LoadedContent = {
  authors: Map<string, IAuthor>
  categories: IProjectCategory[]
}

export interface IProjectCategory {
  name: string
  projects: IProject[]
}

export interface IProject {
  code: string
  name: string
  homepageURL: string
  repoURL: string

  portingEfforts: IPortingEffort[]
}

export interface IAuthor {
  name: string
  kind: EntityKind
  url: string
  githubUsername: string
  giteeUsername: string
}

export interface IPortingEffort {
  authors: string[]

  desc: string
  link: string

  supportStatus: SupportStatus
  releasedSinceVersion: string
  goodSinceVersion: string
  quality: CodeQuality
}
