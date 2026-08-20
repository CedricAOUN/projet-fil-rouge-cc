import React from 'react';
import { MenuItem, Select, FormControl, FormHelperText } from '@mui/material';
import { UNITS } from '@/constants/recipeFormConstants';
import { Controller } from 'react-hook-form';

function UnitSelector({ control, index, error }) {
  return (
    <FormControl fullWidth error={!!error}>
      <Controller
        control={control}
        name={`ingredients.${index}.unit`}
        defaultValue='unit'
        render={({ field }) => (
          <Select
            {...field}
            value={field.value || 'unit'}
            labelId={`unit-label-${index}`}
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
        )}
      />
      {error && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  );
}

export default UnitSelector;
