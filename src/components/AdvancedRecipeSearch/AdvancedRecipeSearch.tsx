import { Box, Stack, TextField, Typography } from '@mui/material'
import React from 'react'
import MultiSelectFilter from './MultiSelectFilter'

const AdvancedRecipeSearch = () => {
  return (
    <Stack height={'100%'} direction={'row'} gap={2} flexGrow={1}>
      {/* FILTERS */}
      <Box sx={{ backgroundColor: '#143a11', width: '30%', height: '100%' }}>
        <Typography variant='h5' sx={{ padding: '20px' }}>
          Filters
        </Typography>
        <MultiSelectFilter label='By ingredient' options={['Chicken', 'Beef', 'Vegetarian', 'Vegan']} onChange={(selected) => console.log(selected)} />
        <MultiSelectFilter label='By rating' options={['1', '2', '3', '4', '5']} onChange={(selected) => console.log(selected)} />
        <MultiSelectFilter label='By chef' options={['Gordon Ramsay', 'Jamie Oliver', 'Nigella Lawson', 'Thomas Keller']} onChange={(selected) => console.log(selected)} />
      </Box>
      {/* RESULTS + GENERAL SEARCH BAR */}
      <Stack gap={2} width={'100%'} height={'100%'}>
        <TextField fullWidth placeholder='Search for recipes...' />
        <Box sx={{ borderRadius: '5px', backgroundColor: '#a52121', width: '100%', height: '100%' }} >
        </Box>
      </Stack>
    </Stack>
  )
}

export default AdvancedRecipeSearch