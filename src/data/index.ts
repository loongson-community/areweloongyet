import { SupportStatus, EntityKind, CodeQuality, IProjectCategory, IProject, IAuthor } from '../types'

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
  'lrzlin': {
    name: 'Lin Runze',
    kind: EntityKind.Community,
    url: '',
    githubUsername: 'lrzlin',
    giteeUsername: '',
  },
  'shipujin': {
    name: 'Shi Pujin',
    kind: EntityKind.Loongson,
    url: '',
    githubUsername: 'shipujin',
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
  'yetist': {
    name: 'WU Xiaotian',
    kind: EntityKind.Loongson,
    url: '',
    githubUsername: 'yetist',
    giteeUsername: '',
  },
}

export const projectCategories: Array<IProjectCategory> = [
  {
    name: '工具链',
    projects: ['binutils', 'gcc', 'glibc', 'musl', 'llvm'],
  },
  {
    name: '编程语言',
    projects: ['go', 'ghc', 'rust'],
  },
  {
    name: '内核',
    projects: ['linux', 'freebsd', 'openbsd', 'rtthread'],
  },
  {
    name: '固件 & 模拟器',
    projects: ['edk2', 'qemu'],
  },
  {
    name: '基础库',
    projects: [],
  },
  {
    name: 'JIT 运行时',
    projects: ['openjdk', 'dotnet'],
  },
  {
    name: '发行版',
    projects: ['gentoo', 'arch', 'debian', 'slackware'],
  },
]

export const projects: Record<string, IProject> = {
  'arch': {
    name: 'Loong Arch Linux',
    homepageURL: '',
    repoURL: 'https://github.com/loongarchlinux',
    portingEfforts: [
      {
        authors: ['yetist'],
        desc: '',
        link: 'https://bbs.loongarch.org/d/126',
        supportStatus: SupportStatus.Released,
        releasedSinceVersion: '',
        goodSinceVersion: '',
        quality: CodeQuality.OnPar,
      },
    ],
  },
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
  'debian': {
    name: 'Debian',
    homepageURL: 'https://www.debian.org',
    repoURL: 'https://salsa.debian.org',
    portingEfforts: [
      {
        authors: ['loongson'],
        desc: '',
        link: 'https://wiki.debian.org/Ports/loong64',
        supportStatus: SupportStatus.WIP,
        releasedSinceVersion: '',
        goodSinceVersion: '',
        quality: CodeQuality.NeedsCleanup,
      },
    ],
  },
  'dotnet': {
    name: '.NET',
    homepageURL: 'https://dot.net',
    repoURL: 'https://github.com/dotnet',
    portingEfforts: [
      {
        authors: ['loongson'],
        desc: '',
        link: '',
        supportStatus: SupportStatus.Released,
        releasedSinceVersion: '7.0',
        goodSinceVersion: '',
        quality: CodeQuality.OnPar,
      },
    ],
  },
  'edk2': {
    name: 'EDK II',
    homepageURL: 'https://github.com/tianocore/tianocore.github.io/wiki/EDK-II',
    repoURL: 'https://github.com/tianocore/edk2',
    portingEfforts: [
      {
        authors: ['loongson'],
        desc: '',
        link: '',
        supportStatus: SupportStatus.Released,
        releasedSinceVersion: '202211',
        goodSinceVersion: '',
        quality: CodeQuality.OnPar,
      },
    ],
  },
  'freebsd': {
    name: 'FreeBSD',
    homepageURL: 'https://www.freebsd.org',
    repoURL: 'https://cgit.freebsd.org',
    portingEfforts: [
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
  'gentoo': {
    name: 'Gentoo',
    homepageURL: 'https://gentoo.org',
    repoURL: 'https://github.com/gentoo/gentoo',
    portingEfforts: [
      {
        authors: ['xen0n'],
        desc: '',
        link: 'https://wiki.gentoo.org/wiki/Project:LoongArch',
        supportStatus: SupportStatus.Released,
        releasedSinceVersion: '',
        goodSinceVersion: '',
        quality: CodeQuality.OnPar,
      },
    ],
  },
  'ghc': {
    name: 'Haskell (GHC)',
    homepageURL: 'https://www.haskell.org/',
    repoURL: 'https://gitlab.haskell.org/ghc/ghc',
    portingEfforts: [
      {
        authors: ['lrzlin'],
        desc: '',
        link: 'https://bbs.loongarch.org/d/150',
        supportStatus: SupportStatus.WaitingRelease,
        releasedSinceVersion: '',
        goodSinceVersion: '',
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
  'go': {
    name: 'Go',
    homepageURL: 'https://go.dev',
    repoURL: 'https://github.com/golang/go',
    portingEfforts: [
      {
        authors: ['loongson'],
        desc: '',
        link: '',
        supportStatus: SupportStatus.Released,
        releasedSinceVersion: '1.19',
        goodSinceVersion: '1.19',
        quality: CodeQuality.OnPar,
      },
    ],
  },
  'openjdk': {
    name: 'OpenJDK',
    homepageURL: 'https://openjdk.org/projects/jdk/',
    repoURL: 'https://github.com/openjdk/jdk',
    portingEfforts: [
      {
        authors: ['loongson'],
        desc: '',
        link: '',
        supportStatus: SupportStatus.WIP,
        releasedSinceVersion: '',
        goodSinceVersion: '',
        quality: CodeQuality.NoCode,
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
  'llvm': {
    name: 'LLVM',
    homepageURL: 'https://llvm.org',
    repoURL: 'https://github.com/llvm/llvm-project',
    portingEfforts: [
      {
        authors: ['loongson', 'xen0n'],
        desc: '',
        link: '',
        supportStatus: SupportStatus.WaitingRelease,
        releasedSinceVersion: '16.0.0',
        goodSinceVersion: '16.0.0',
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
  'openbsd': {
    name: 'OpenBSD',
    homepageURL: 'https://www.openbsd.org',
    repoURL: 'https://github.com/openbsd',
    portingEfforts: [
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
  'rtthread': {
    name: 'RT-Thread',
    homepageURL: 'https://www.rt-thread.io',
    repoURL: 'https://github.com/RT-Thread/rt-thread',
    portingEfforts: [
      {
        authors: [],
        desc: '',
        link: '',
        supportStatus: SupportStatus.CommercialOnly,
        releasedSinceVersion: '',
        goodSinceVersion: '',
        quality: CodeQuality.NoCode,
      },
    ],
  },
  'rust': {
    name: 'Rust',
    homepageURL: 'https://www.rust-lang.org',
    repoURL: 'https://github.com/rust-lang/rust',
    portingEfforts: [
      {
        authors: ['loongson'],
        desc: '',
        link: '',
        supportStatus: SupportStatus.UnderReview,
        releasedSinceVersion: '',
        goodSinceVersion: '',
        quality: CodeQuality.OnPar,
      },
    ],
  },
  'slackware': {
    name: 'Slackware',
    homepageURL: '',
    repoURL: 'https://github.com/shipujin/slackware-loongarch64',
    portingEfforts: [
      {
        authors: ['shipujin'],
        desc: '',
        link: 'https://bbs.loongarch.org/d/95',
        supportStatus: SupportStatus.Released,
        releasedSinceVersion: '',
        goodSinceVersion: '',
        quality: CodeQuality.OnPar,
      },
    ],
  },
}
