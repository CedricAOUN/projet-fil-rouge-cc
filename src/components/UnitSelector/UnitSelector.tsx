import { useTranslation } from 'react-i18next';
import React from 'react';
import { MenuItem, Select, FormControl, FormHelperText } from '@mui/material';
import { getUnits } from '@/constants/recipeFormConstants';
import { Controller } from 'react-hook-form';

function UnitSelector({ control, index, error }) {
  const { t } = useTranslation();
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
            <MenuItem value='unit' disabled>{t("Unit")}</MenuItem>
            {getUnits(t).map((unit) => (
              <MenuItem key={unit.value} value={unit.value}>
                {unit.label}
              </MenuItem>
            ))}
          </Select>
        )}
      />
    </FormControl>
  );
}

export default UnitSelector;
