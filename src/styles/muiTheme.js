import { createMuiTheme } from '@material-ui/core/styles'

export default createMuiTheme({
  typography: {
    useNextVariants: true,
    fontFamily: [
      'Lato',
      'Helvetica Neue',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
  },
})
