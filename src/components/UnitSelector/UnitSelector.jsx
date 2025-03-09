import React, { useState } from 'react';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';

function UnitSelector({ onUnitChange }) {
  const [unit, setUnit] = useState('');

  const handleChange = (event) => {
    const selectedUnit = event.target.value;
    setUnit(selectedUnit);
    if (onUnitChange) {
      onUnitChange(selectedUnit); // Pass the value to the parent
    }
  };

  return (
    <FormControl sx={{ width: '200px' }}>
      <InputLabel id="unit-select-label">Unit</InputLabel>
      <Select
        labelId="unit-select-label"
        id="unit-select"
        size='small'
        value={unit}
        onChange={handleChange}
      >
        <MenuItem value="ml">Milliliter (ml)</MenuItem>
        <MenuItem value="l">Liter (L)</MenuItem>
        <MenuItem value="tsp">Teaspoon (tsp)</MenuItem>
        <MenuItem value="tbsp">Tablespoon (tbsp)</MenuItem>
        <MenuItem value="cup">Cup</MenuItem>
        <MenuItem value="fl_oz">Fluid Ounce (fl oz)</MenuItem>
        <MenuItem value="g">Gram (g)</MenuItem>
        <MenuItem value="kg">Kilogram (kg)</MenuItem>
        <MenuItem value="oz">Ounce (oz)</MenuItem>
        <MenuItem value="lb">Pound (lb)</MenuItem>
      </Select>
    </FormControl>
  );
}

export default UnitSelector;
