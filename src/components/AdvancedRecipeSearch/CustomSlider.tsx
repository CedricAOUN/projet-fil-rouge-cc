import React, { useState } from 'react';
import { Slider, Typography, Stack } from '@mui/material';

interface RatingSliderProps {
  label: string;
  min?: number;
  max?: number;
  onChange: (value: number | number[]) => void;
}

const CustomSlider = ({
  label,
  min = 0,
  max = 5,
  onChange,
}: RatingSliderProps) => {
  const [value, setValue] = useState<number | number[]>([min, max]);

  const handleChange = (_: Event, newValue: number | number[]) => {
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <Stack gap={1}>
      <Typography variant='body2' ml={1}>
        {label}
      </Typography>
      <Stack direction={'row'} alignItems={'center'} gap={1}>
        <Typography
          variant='body2'
          sx={{ width: '30px', flexShrink: 0, textAlign: 'center' }}
        >
          {value[0]}
        </Typography>
        <Slider
          value={value}
          min={min}
          max={max}
          onChange={handleChange}
          step={1}
          valueLabelDisplay='auto'
          sx={{ mx: 1, width: 'calc(100% - 16px)' }}
        />
        <Typography
          variant='body2'
          sx={{ width: '30px', flexShrink: 0, textAlign: 'center' }}
        >
          {value[1]}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default CustomSlider;
