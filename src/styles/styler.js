import { css, cx as emotionCx } from 'emotion'

export default (styles) => {
  const wrappedStyles = {}

  Object.entries(styles).forEach(([name, value]) => {
    wrappedStyles[name] = css`${value}`
  })

  return wrappedStyles
}

export const cx = emotionCx
