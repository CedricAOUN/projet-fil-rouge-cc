import React, { useState } from 'react'
import {
  Autocomplete,
  Checkbox,
  Chip,
  TextField,
} from '@mui/material'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'

interface MultiSelectFilterProps {
  options: string[]
  label: string
  onChange: (selected: string[]) => void
}

const MultiSelectFilter = ({ options, label, onChange }: MultiSelectFilterProps) => {
  const [value, setValue] = useState<string[]>([])

  const handleChange = (_: React.SyntheticEvent, newValue: string[]) => {
    setValue(newValue)
    onChange(newValue)
  }

  return (
    <Autocomplete
      multiple
      options={options}
      value={value}
      onChange={handleChange}
      disableCloseOnSelect
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
            checkedIcon={<CheckBoxIcon fontSize="small" />}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option}
        </li>
      )}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip label={option} size="small" {...getTagProps({ index })} key={option} />
        ))
      }
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder="Search..." size="small" />
      )}
    />
  )
}

export default MultiSelectFilter
