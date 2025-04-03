import React, { useState } from 'react';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';

function UnitSelector({ onUnitChange }) {
  const [unit, setUnit] = useState('none');

  const handleChange = (event) => {
    const selectedUnit = event.target.value;
    setUnit(selectedUnit);
    if (onUnitChange) {
      onUnitChange(selectedUnit); // Pass the value to the parent
    }
  };

  return (
    <FormControl sx={{ minWidth: '150px', width: '100%' }}>
      <Select
        labelId="unit-select-label"
        id="unit-select"
        size='small'
        value={unit}
        onChange={handleChange}
        sx={{ height: '40px' }}
      >
        <MenuItem value="none">Unit</MenuItem>
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
