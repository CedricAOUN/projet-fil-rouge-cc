import { useGetChefsQuery } from '@/api/authApi';
import ChefsList from '@/components/ChefsList/ChefsList';
import CourseList from '@/components/CourseList/CourseList';
import useDebounce from '@/utils/useDebounce';
import {
  CircularProgress,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import React, { useState } from 'react';

const CoursesPage = () => {
  const [mode, setMode] = useState<'course' | 'chef'>('course');
  const [query, setQuery] = useState<string>('');
  const debouncedQuery = useDebounce(query, 300);

  const { data: chefs, isLoading: isChefsLoading } = useGetChefsQuery({
    query: debouncedQuery,
  });

  const isLoading = isChefsLoading || debouncedQuery != query;

  const handleSwitchMode = (newMode) => {
    setMode(newMode);
    setQuery('');
  };

  return (
    <Stack width={'100%'} alignItems={'center'} gap={1}>
      <ToggleButtonGroup value={mode}>
        <ToggleButton
          value={'course'}
          onClick={() => handleSwitchMode('course')}
        >
          By Courses
        </ToggleButton>
        <ToggleButton value={'chef'} onClick={() => handleSwitchMode('chef')}>
          By Chef
        </ToggleButton>
      </ToggleButtonGroup>
      <TextField
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='Search'
        fullWidth
      />
      {isLoading && (
        <Stack direction={'row'} justifyContent={'center'} p={3}>
          <CircularProgress size={'50px'} />
        </Stack>
      )}
      {mode == 'chef' && !isLoading && <ChefsList chefs={chefs?.data} />}
      {/* {mode == 'course' && <CourseList />} */}
    </Stack>
  );
};

export default CoursesPage;
