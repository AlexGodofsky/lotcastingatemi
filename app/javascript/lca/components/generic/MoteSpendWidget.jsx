import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Button from 'material-ui/Button'
import ButtonBase from 'material-ui/ButtonBase'
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog'
import Checkbox from 'material-ui/Checkbox'
import { FormControlLabel } from 'material-ui/Form'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'

import RatingField from './RatingField.jsx'
import ResourceDisplay from './ResourceDisplay.jsx'
import { spendMotes } from '../../ducks/actions.js'
import { canIEditCharacter, canIEditQc } from '../../selectors'
import { clamp } from '../../utils'
import { prettyAnimaLevel, committedPersonalMotes, committedPeripheralMotes } from '../../utils/calculated'

const WillRaiseAnima = ({ current, spending, mute }) => {
  if (spending < 5 || current === 3)
    return <Typography>No change to anima{ current === 3 && ' (already at Bonfire)' }</Typography>
  if (mute)
    return <Typography>Will not change anima (mute)</Typography>

  const newLevel = Math.min(current + Math.floor(spending / 5), 3)
  return <Typography>
    Will raise anima from { prettyAnimaLevel(current) } to { prettyAnimaLevel(newLevel) }
  </Typography>
}
WillRaiseAnima.propTypes = { current: PropTypes.number, spending: PropTypes.number, mute: PropTypes.bool }

class MoteSpendWidget extends React.Component {
  constructor(props) {
    super(props)
    this.state = { open: false, toSpend: 0, commit: false, commitName: '', mute: false }

    this.max = this.max.bind(this)
    this.min = this.min.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleCheck = this.handleCheck.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  max() {
    const { peripheral, character } = this.props
    return peripheral ? character.motes_peripheral_current : character.motes_personal_current
  }

  min() {
    const { peripheral, character } = this.props
    if (peripheral)
      return character.motes_peripheral_current - (character.motes_peripheral_total - committedPeripheralMotes(character))
    else
      return character.motes_personal_current - (character.motes_personal_total - committedPersonalMotes(character))
  }

  handleOpen() {
    this.setState({ open: true })
  }

  handleClose() {
    this.setState({ open: false })
  }

  handleAdd(motes) {
    let commit = (this.state.toSpend + motes) <= 0 ? false : this.state.commit
    this.setState({ toSpend: clamp(this.state.toSpend + motes, this.min(), this.max()), commit: commit })
  }

  handleChange(e) {
    const { name, value } = e.target
    let commit = this.state.commit
    if (name === 'toSpend')
      commit = (this.state.toSpend + value) >= 0
    this.setState({ [name]: value, commit: commit })
  }

  handleCheck(e) {
    this.setState({ [e.target.name]: !this.state[e.target.name] })
  }

  handleSubmit() {
    const { toSpend, commit, commitName, mute } = this.state
    const { character, qc, peripheral } = this.props
    const pool = peripheral ? 'peripheral' : 'personal'

    const characterType = qc ? 'qc' : 'character'
    let committments
    if (commit) {
      committments = this.props.character.motes_committed.concat([{
        pool: pool, label: commitName, motes: toSpend
      }])
    }

    this.props.spendMotes(character.id, toSpend, pool, characterType, committments, mute)

    this.setState({ open: false, toSpend: 0, commit: false, commitName: '', mute: false })
  }

  render() {
    const { toSpend, commit, commitName, open, mute } = this.state
    const {
      handleOpen, handleClose, handleAdd, handleChange, handleCheck, handleSubmit,
      max, min
    } = this
    const { canEdit, children, character, peripheral } = this.props

    if (!canEdit) {
      return children
    }

    return <React.Fragment>
      <ButtonBase onClick={ handleOpen }>
        { children }
      </ButtonBase>
      <Dialog
        open={ open }
        onClose={ handleClose }
      >
        <DialogTitle>
          { toSpend >= 0 ? 'Spend' : 'Recover'} { peripheral ? 'Peripheral' : 'Personal' } Motes
        </DialogTitle>

        <DialogContent>
          <div style={{ textAlign: 'center' }}>
            <ResourceDisplay
              current={ peripheral ? character.motes_peripheral_current: character.motes_personal_current }
              total={ peripheral ? character.motes_peripheral_total : character.motes_personal_total }
              committed={ peripheral ? committedPeripheralMotes(character) : committedPersonalMotes(character) }
              label="Current Pool"
            />
          </div>
          <div>
            <Button size="small" onClick={ () => handleAdd(-5) }>-5</Button>
            <Button size="small" onClick={ () => handleAdd(-1) }>-1</Button>
            &nbsp;&nbsp;
            <RatingField trait="toSpend" value={ toSpend }
              label="Motes" narrow margin="dense"
              max={ max() } min={ min() }
              onChange={ handleChange }
            />

            <Button size="small" onClick={ () => handleChange({ target: { name: 'toSpend', value: 0 }})}>
              0
            </Button>
            <Button size="small" onClick={ () => handleAdd(1) }>+1</Button>
            <Button size="small" onClick={ () => handleAdd(5) }>+5</Button>
            <Button size="small" onClick={ () => handleAdd(10) }>+10</Button>
          </div>

          <div>
            <FormControlLabel label="Commit motes?" style={{ marginTop: '1em' }}
              control={
                <Checkbox name="commit" checked={ commit } onChange={ handleCheck }  disabled={ toSpend < 0 } />
              }
            />
            { commit &&
              <TextField name="commitName" value={ commitName }
                label="Commit label" margin="dense"
                onChange={ handleChange }
              />
            }
          </div>

          { peripheral &&
            <React.Fragment>
              <div>
                <FormControlLabel label="Mute"
                  control={
                    <Checkbox name="mute" checked={ mute } onChange={ handleCheck } />
                  }
                />
              </div>
              <WillRaiseAnima current={ character.anima_level } spending={ toSpend } mute={ mute } />
            </React.Fragment>
          }
        </DialogContent>

        <DialogActions>
          <Button onClick={ handleClose }>
            Cancel
          </Button>
          <Button variant="raised" color="primary" onClick={ handleSubmit }>
            { toSpend >= 0 ? 'Spend' : 'Recover'}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  }
}
MoteSpendWidget.propTypes = {
  children: PropTypes.node.isRequired,
  character: PropTypes.object.isRequired,
  peripheral: PropTypes.bool,
  qc: PropTypes.bool,
  canEdit: PropTypes.bool,
  spendMotes: PropTypes.func,
}
function mapStateToProps(state, props) {
  return {
    canEdit: props.qc ? canIEditQc(state, props.character.id) : canIEditCharacter(state, props.character.id)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    spendMotes: (id, motes, pool, characterType, committments, mute) => dispatch(spendMotes(id, motes, pool, characterType, committments, mute)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MoteSpendWidget)