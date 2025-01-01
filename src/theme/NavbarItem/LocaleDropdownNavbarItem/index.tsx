import React from 'react'
import clsx from 'clsx'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useAlternatePageUtils } from '@docusaurus/theme-common/internal'
import { useLocation } from '@docusaurus/router'
import DropdownNavbarItem from '@theme/NavbarItem/DropdownNavbarItem'
import IconLanguage from '@theme/Icon/Language'
import type { LinkLikeNavbarItemProps } from '@theme/NavbarItem'
import type { Props } from '@theme/NavbarItem/LocaleDropdownNavbarItem'

import styles from './styles.module.css'

export default function LocaleDropdownNavbarItem({
  mobile,
  dropdownItemsBefore,
  dropdownItemsAfter,
  queryString = '',
  ...props
}: Props): JSX.Element {
  const {
    i18n: { currentLocale, locales, localeConfigs },
  } = useDocusaurusContext()
  const alternatePageUtils = useAlternatePageUtils()
  const { search, hash } = useLocation()

  const localeItems = locales.map((locale): LinkLikeNavbarItemProps => {
    const baseTo = `pathname://${alternatePageUtils.createUrl({
      locale,
      fullyQualified: false,
    })}`
    // preserve ?search#hash suffix on locale switches
    const to = `${baseTo}${search}${hash}${queryString}`
    return {
      label: localeConfigs[locale]!.label,
      lang: localeConfigs[locale]!.htmlLang,
      to,
      target: '_self',
      autoAddBaseUrl: false,
      className:
        // eslint-disable-next-line no-nested-ternary
        locale === currentLocale
          ? // Similar idea as DefaultNavbarItem: select the right Infima active
            // class name. This cannot be substituted with isActive, because the
            // target URLs contain `pathname://` and therefore are not NavLinks!
            mobile
            ? 'menu__link--active'
            : 'dropdown__link--active'
          : '',
    }
  })

  const items = [...dropdownItemsBefore, ...localeItems, ...dropdownItemsAfter]

  // swizzle modification: the label is removed for the item to take less
  // horizontal space

  return (
    <DropdownNavbarItem
      {...props}
      mobile={mobile}
      className={clsx(styles.awlyLocaleDropdown, props.className)}
      label={
        <IconLanguage className={styles.iconLanguage} />
        // swizzle modification: removed label
      }
      items={items}
    />
  )
}
