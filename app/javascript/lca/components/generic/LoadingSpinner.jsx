import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import SvgIcon from 'material-ui/SvgIcon'

import DawnSpinner from '../../icons/DawnSpinner'

const styles = theme => ({ // eslint-disable-line no-unused-vars
  wrap: {
    display: 'block',
    position: 'fixed',
    bottom: '2em',
    width: '100%',
    textAlign: 'center',
    zIndex: '2000',
  },
  paper: {
    display: 'inline-block',
    padding: '0.5em',
    borderRadius: '2em',
  },
  icon: {
    animation: 'spin 0.8s steps(8, end) infinite',
    stroke: theme.typography.body1.color,
    height: '1.75em',
    width: '1.75em',
    marginBottom: '-4px',
  },
})

function LoadingSpinner(props) {
  const { classes } = props

  return <div className={ classes.wrap }>
    <Paper square={ false } elevation={ 6 }
      classes={{ root: classes.paper }}
    >
      <SvgIcon viewBox="0 0 51 51" className={ classes.icon }><DawnSpinner /></SvgIcon>
    </Paper>
  </div>
}
LoadingSpinner.propTypes = {
  classes: PropTypes.object,
}

export default withStyles(styles)(LoadingSpinner)
