import { SupportStatus, EntityKind, CodeQuality, IProject, IAuthor } from '../types'

// 编辑时请保持以字母顺序排列以下内容：
// Please keep the following contents in alphabetical order while editing:
//
// - keys in authors
// - keys in projects
// - 每条移植工作记录中的作者代码列表 / list of author codes in each porting
//   effort record

export const authors: Record<string, IAuthor> = {
  'loongson': {
    name: 'Loongson',
    kind: EntityKind.Loongson,
    url: 'https://loongson.cn',
    githubUsername: 'loongson',
    giteeUsername: '',
  },
  'xen0n': {
    name: 'WANG Xuerui',
    kind: EntityKind.Community,
    url: 'https://blog.xen0n.name',
    githubUsername: 'xen0n',
    giteeUsername: 'xen0n',
  },
  'xry111': {
    name: 'Xi Ruoyao',
    kind: EntityKind.Community,
    url: 'https://blog.xry111.site',
    githubUsername: 'xry111',
    giteeUsername: '',
  },
}

export const projects: Record<string, IProject> = {
  'binutils': {
    name: 'binutils',
    homepageURL: 'https://www.gnu.org/software/binutils/',
    repoURL: 'https://sourceware.org/git/gitweb.cgi?p=binutils-gdb.git',
    portingEfforts: [
      {
        authors: ['loongson'],
        desc: '',
        link: '',
        supportStatus: SupportStatus.Released,
        releasedSinceVersion: '2.38',
        goodSinceVersion: '2.40',
        quality: CodeQuality.OnPar,
      },
    ],
  },
  'gcc': {
    name: 'gcc',
    homepageURL: 'https://gcc.gnu.org',
    repoURL: 'https://gcc.gnu.org/git/?p=gcc.git',
    portingEfforts: [
      {
        authors: ['loongson', 'xry111'],
        desc: '',
        link: '',
        supportStatus: SupportStatus.Released,
        releasedSinceVersion: '12.1',
        goodSinceVersion: '13.1',
        quality: CodeQuality.OnPar,
      },
    ],
  },
  'glibc': {
    name: 'glibc',
    homepageURL: 'https://www.gnu.org/software/libc/',
    repoURL: 'https://sourceware.org/git/gitweb.cgi?p=glibc.git',
    portingEfforts: [
      {
        authors: ['loongson', 'xry111'],
        desc: '',
        link: '',
        supportStatus: SupportStatus.Released,
        releasedSinceVersion: '2.36',
        goodSinceVersion: '2.36',
        quality: CodeQuality.OnPar,
      },
    ],
  },
  'linux': {
    name: 'Linux',
    homepageURL: 'https://kernel.org',
    repoURL: 'https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/',
    portingEfforts: [
      {
        authors: ['loongson', 'xen0n', 'xry111'],
        desc: '',
        link: '',
        supportStatus: SupportStatus.Released,
        releasedSinceVersion: '5.19',
        goodSinceVersion: '6.2',
        quality: CodeQuality.OnPar,
      },
    ],
  },
  'musl': {
    name: 'musl',
    homepageURL: 'https://musl.libc.org/',
    repoURL: 'https://git.musl-libc.org/cgit/musl',
    portingEfforts: [
      {
        authors: ['loongson'],
        desc: '',
        link: 'https://www.openwall.com/lists/musl/2022/11/15/1',
        supportStatus: SupportStatus.UnderReview,
        releasedSinceVersion: '',
        goodSinceVersion: '',
        quality: CodeQuality.OnPar,
      },
    ],
  },
  'qemu': {
    name: 'QEMU',
    homepageURL: 'https://www.qemu.org/',
    repoURL: 'https://gitlab.com/qemu-project/qemu/',
    portingEfforts: [
      {
        authors: ['xen0n'],
        desc: 'TCG LoongArch64 port',
        link: '',
        supportStatus: SupportStatus.Released,
        releasedSinceVersion: '7.0.0',
        goodSinceVersion: '7.0.0',
        quality: CodeQuality.OnPar,
      },
      {
        authors: ['loongson'],
        desc: 'LoongArch target',
        link: '',
        supportStatus: SupportStatus.Released,
        releasedSinceVersion: '7.1.0',
        goodSinceVersion: '7.2.0',
        quality: CodeQuality.OnPar,
      },
    ],
  },
}
