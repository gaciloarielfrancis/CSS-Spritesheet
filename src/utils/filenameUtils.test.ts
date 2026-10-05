import { describe, expect, it } from 'vitest'
import {
  fileNameToClassName,
  sanitizeBaseName,
  sanitizeFileBaseName,
  sanitizePrefix,
  uniquifyClassNames,
} from '../utils/filenameUtils'

describe('filename conversion', () => {
  it('converts home.png → icon-home', () => {
    expect(fileNameToClassName('home.png', 'icon')).toBe('icon-home')
  })

  it('converts shopping-cart.png → icon-shopping-cart', () => {
    expect(fileNameToClassName('shopping-cart.png', 'icon')).toBe('icon-shopping-cart')
  })

  it('converts user_profile.png → icon-user-profile', () => {
    expect(fileNameToClassName('user_profile.png', 'icon')).toBe('icon-user-profile')
  })

  it('sanitizes spaces, caps and extensions', () => {
    expect(sanitizeBaseName('My Cool Icon@2x.PNG')).toBe('my-cool-icon-2x')
  })

  it('prefixes names starting with a digit', () => {
    expect(sanitizeBaseName('32px-icon.png')).toBe('s-32px-icon')
  })

  it('falls back for empty names', () => {
    expect(sanitizeBaseName('!!!.png')).toBe('sprite')
    expect(sanitizePrefix('')).toBe('sprite')
    expect(sanitizeFileBaseName('')).toBe('spritesheet')
  })

  it('uniquifies duplicates with -2, -3 suffixes', () => {
    expect(uniquifyClassNames(['sprite-home', 'sprite-home', 'sprite-home'])).toEqual([
      'sprite-home',
      'sprite-home-2',
      'sprite-home-3',
    ])
  })
})
