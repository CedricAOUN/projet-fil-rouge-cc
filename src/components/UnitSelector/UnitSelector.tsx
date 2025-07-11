import React from 'react';
import { MenuItem, Select, FormControl, FormHelperText } from '@mui/material';
import { UNITS } from '@/constants/recipeFormConstants';

function UnitSelector({ register, index, error }) {
  return (
    <FormControl fullWidth error={!!error}>
      <Select
        {...register(`ingredients.${index}.unit`)} // Pass register here
        labelId={`unit-label-${index}`}
        defaultValue={'unit'}
        size='small'
        sx={{
          maxHeight: '41px',
          padding: '0px',
        }}
      >
        <MenuItem value='unit' disabled>
          Unit
        </MenuItem>
        {UNITS.map((unit) => (
          <MenuItem key={unit.value} value={unit.value}>
            {unit.label}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  );
}

export default UnitSelector;
