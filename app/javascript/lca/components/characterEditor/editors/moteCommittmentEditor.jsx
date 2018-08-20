// @flow
import * as React from 'react'
const { Fragment } = React
import { shouldUpdate } from 'recompose'

import Checkbox from '@material-ui/core/Checkbox'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'

import ListAttributeEditor, {
  type ListAttributeFieldTypes,
} from 'components/generic/ListAttributeEditor.jsx'
import RatingField from 'components/generic/RatingField.jsx'
import { isUnequalByKeys } from 'utils'
import type { withMotePool } from 'utils/flow-types'

function CommitFields(props: ListAttributeFieldTypes) {
  const { trait, onChange, onBlur, onRatingChange, classes } = props
  const { pool, label, motes, scenelong } = trait

  return (
    <Fragment>
      <TextField
        select
        name="pool"
        value={pool}
        className={classes.withMargin}
        label="Pool"
        margin="dense"
        onChange={onRatingChange}
      >
        <MenuItem value="personal">Pers</MenuItem>
        <MenuItem value="peripheral">Peri</MenuItem>
      </TextField>

      <TextField
        name="label"
        value={label}
        className={classes.nameField}
        label="For"
        margin="dense"
        onChange={onChange}
        onBlur={onBlur}
      />

      <RatingField
        trait="motes"
        value={motes}
        label="Motes"
        min={0}
        margin="dense"
        narrow
        onChange={onRatingChange}
      />
      <div className={classes.checkboxWrap}>
        <div className={classes.floatingLabel}>Scene</div>
        <Checkbox
          name="scenelong"
          checked={scenelong}
          value={(scenelong || false).toString()}
          onChange={onRatingChange}
        />
      </div>
    </Fragment>
  )
}

type Props = { character: withMotePool & { id: number }, onChange: Function }
const MoteCommittmentEditor = ({ character, onChange }: Props) => {
  return (
    <ListAttributeEditor
      label="Mote Committments"
      character={character}
      trait="motes_committed"
      Fields={CommitFields}
      newObject={{ pool: 'peripheral', label: '', motes: 0 }}
      onChange={onChange}
    />
  )
}

export default shouldUpdate((props, newProps) =>
  isUnequalByKeys(props.character, newProps.character, ['motes_committed'])
)(MoteCommittmentEditor)
