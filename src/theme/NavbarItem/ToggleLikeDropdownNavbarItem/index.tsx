import React, { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'
import {
  isRegexpStringMatch,
  useCollapsible,
  Collapsible,
} from '@docusaurus/theme-common'
import { isSamePath, useLocalPathname } from '@docusaurus/theme-common/internal'
import NavbarNavLink from '@theme/NavbarItem/NavbarNavLink'
import NavbarItem, { type LinkLikeNavbarItemProps } from '@theme/NavbarItem'
import type {
  DesktopOrMobileNavBarItemProps,
  Props as DropdownNavbarItemProps,
} from '@theme/NavbarItem/DropdownNavbarItem'
import styles from './styles.module.css'

function isItemActive(
  item: LinkLikeNavbarItemProps,
  localPathname: string,
): boolean {
  if (isSamePath(item.to, localPathname)) {
    return true
  }
  if (isRegexpStringMatch(item.activeBaseRegex, localPathname)) {
    return true
  }
  if (item.activeBasePath && localPathname.startsWith(item.activeBasePath)) {
    return true
  }
  return false
}

function containsActiveItems(
  items: readonly LinkLikeNavbarItemProps[],
  localPathname: string,
): boolean {
  return items.some((item) => isItemActive(item, localPathname))
}

interface DesktopOrMobileNavBarItemPropsWithIcon
  extends DesktopOrMobileNavBarItemProps {
  icon?: React.JSX.Element
}

interface Props extends DropdownNavbarItemProps {
  icon?: React.JSX.Element
}

function ToggleLikeDropdownNavbarItemDesktop({
  items,
  icon,
  position,
  className,
  onClick,
  ...props
}: DesktopOrMobileNavBarItemPropsWithIcon) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent | TouchEvent | FocusEvent,
    ) => {
      if (
        !dropdownRef.current ||
        dropdownRef.current.contains(event.target as Node)
      ) {
        return
      }
      setShowDropdown(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    document.addEventListener('focusin', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
      document.removeEventListener('focusin', handleClickOutside)
    }
  }, [dropdownRef])

  return (
    <div
      ref={dropdownRef}
      className={clsx(
        'navbar__item',
        'dropdown',
        'dropdown--hoverable',
        'toggleLikeDropdown',
        {
          'dropdown--right': position === 'right',
          'dropdown--show': showDropdown,
        },
      )}
    >
      <NavbarNavLink
        aria-haspopup="true"
        aria-expanded={showDropdown}
        role="button"
        // # hash permits to make the <a> tag focusable in case no link target
        // See https://github.com/facebook/docusaurus/pull/6003
        // There's probably a better solution though...
        href={props.to ? undefined : '#'}
        className={clsx('navbar__link', className)}
        {...props}
        label={icon}
        onClick={props.to ? undefined : (e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            setShowDropdown(!showDropdown)
          }
        }}
      >
        {props.children ?? props.label}
      </NavbarNavLink>
      <ul className="dropdown__menu">
        {items.map((childItemProps, i) => (
          <NavbarItem
            isDropdownItem
            activeClassName="dropdown__link--active"
            {...childItemProps}
            key={i}
          />
        ))}
      </ul>
    </div>
  )
}

function ToggleLikeDropdownNavbarItemMobile({
  items,
  icon,
  className,
  position, // Need to destructure position from props so that it doesn't get passed on.
  onClick,
  ...props
}: DesktopOrMobileNavBarItemPropsWithIcon) {
  const localPathname = useLocalPathname()
  const containsActive = containsActiveItems(items, localPathname)

  const { collapsed, toggleCollapsed, setCollapsed } = useCollapsible({
    initialState: () => !containsActive,
  })

  // Expand/collapse if any item active after a navigation
  useEffect(() => {
    if (containsActive) {
      setCollapsed(!containsActive)
    }
  }, [localPathname, containsActive, setCollapsed])

  return (
    <li
      className={clsx('menu__list-item', {
        'menu__list-item--collapsed': collapsed,
      })}
    >
      <NavbarNavLink
        role="button"
        className={clsx(
          styles.dropdownNavbarItemMobile,
          'menu__link menu__link--sublist menu__link--sublist-caret',
          className,
        )}
        {...props}
        label={
          <>
            {icon}
            {props.label}
          </>
        }
        onClick={(e) => {
          e.preventDefault()
          toggleCollapsed()
        }}
      >
        {props.children ?? props.label}
      </NavbarNavLink>
      <Collapsible lazy as="ul" className="menu__list" collapsed={collapsed}>
        {items.map((childItemProps, i) => (
          <NavbarItem
            mobile
            isDropdownItem
            onClick={onClick}
            activeClassName="menu__link--active"
            {...childItemProps}
            key={i}
          />
        ))}
      </Collapsible>
    </li>
  )
}

export default function ToggleLikeDropdownNavbarItem({
  mobile = false,
  ...props
}: Props): React.JSX.Element {
  const Comp = mobile
    ? ToggleLikeDropdownNavbarItemMobile
    : ToggleLikeDropdownNavbarItemDesktop
  return <Comp {...props} />
}
