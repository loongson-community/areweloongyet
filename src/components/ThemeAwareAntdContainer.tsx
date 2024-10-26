import React from 'react'
import { ConfigProvider, theme } from 'antd'
import BrowserOnly from '@docusaurus/BrowserOnly'
import { useColorMode } from '@docusaurus/theme-common'

export default function ThemeAwareAntdContainer(
  props: React.PropsWithChildren,
): JSX.Element {
  const isDarkMode = useColorMode().colorMode == 'dark'
  const alg = isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm
  return (
    <BrowserOnly>
      {() => (
        <ConfigProvider theme={{ algorithm: alg }}>
          {props.children}
        </ConfigProvider>
      )}
    </BrowserOnly>
  )
}
