// helper function to merge classes in our components
// PROBLEM: components have default classes based on our designs;
//          passing in `classes` prop overrides default styles
// SOLUTION: a helper function that will merge classes without overriding
//           all of the default styles, but only the ones that need to be

import { cx } from 'styler'

// ___styles are { [muiClassName]: {...styles} }
const compose = (oldStyles = {}, newStyles = {}) => {
  const composedStyles = {
    ...oldStyles,
  }

  Object.entries(newStyles).forEach(([key, value]) => {
    const hasProp = Object.hasOwnProperty.call(composedStyles, key)

    if (hasProp) {
      // merge styles
      composedStyles[key] = cx(oldStyles[key], value)
    } else {
      composedStyles[key] = value
    }
  })

  return composedStyles
}

export default compose
