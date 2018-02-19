import React from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'

import Paper from 'material-ui/Paper'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'

import { fullQc } from '../../utils/propTypes'

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3
  })
})

function QcListItem(props) {
  const { qc, classes } = props

  return <div>
    <Paper className={ classes.root }>
      <Typography variant="title">
        { qc.name }
      </Typography>

      <Button component={ Link } to={ `/qcs/${qc.id}` }>
        Full Sheet
      </Button>
      <Button component={ Link } to={ `/qcs/${qc.id}/edit` }>
        Edit
      </Button>
    </Paper>
  </div>
}

QcListItem.propTypes = {
  qc: PropTypes.shape(fullQc),
  classes: PropTypes.object
}

export default withStyles(styles)(QcListItem)
