import React, { useState } from 'react';
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import { UNITS } from '../../constants/recipeFormConstants';

function UnitSelector({ onUnitChange, register, index, error }) {
  const [unit, setUnit] = useState('');

  const handleChange = (event) => {
    const selectedUnit = event.target.value;
    setUnit(selectedUnit);
    if (onUnitChange) {
      onUnitChange(selectedUnit); // Pass the value to the parent
    }
  };

  return (
    <FormControl fullWidth error={!!error}>
      <InputLabel id={`unit-label-${index}`}>Unit</InputLabel>
      <Select
        {...register(`ingredients.${index}.unit`)} // Pass register here
        labelId={`unit-label-${index}`}
        value={unit}
        onChange={handleChange}
      >
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
