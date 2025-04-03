import React, { useState } from 'react';
import {
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ImageIcon from '@mui/icons-material/Image';
import UnitSelector from '../../components/UnitSelector/UnitSelector';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { UNIT_VALUES, UNITS } from '../../constants/recipeFormConstants';

// Define validation schema
const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string(),
  instructions: yup.string().required('Instructions are required'),
  duration: yup
    .number()
    .typeError('Please enter a valid number for duration') // Custom type error
    .positive('Duration must be positive'),
  ingredients: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required('Ingredient name is required'),
        amount: yup.string().required('Amount is required'),
        unit: yup.string().oneOf(UNIT_VALUES, 'Unit is required'),
      })
    )
    .min(1, 'At least one ingredient is required'),
});

function RecipeCreateForm() {
  const isMobile = useMediaQuery('(max-width:900px)');
  const [imagePreview, setImagePreview] = useState('No Image Selected');

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      instructions: '',
      duration: '',
      ingredients: [{ name: '', amount: '', unit: '' }],
      image: null,
    },
  });

  // Setup field array for ingredients
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients',
  });

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(file.name);
      setValue('image', file);
    }
  };

  // Handle unit selection
  const handleUnitChange = (index, value) => {
    setValue(`ingredients.${index}.unit`, value);
  };

  // Submit handler
  const onSubmit = (data) => {
    console.log('Recipe Data:', data);
    // Here you would typically send the data to your backend
  };

  return (
    <Paper sx={{ display: 'flex', flexDirection: 'column', gap: '20px', p: 3 }}>
      <Typography variant='h4'>General</Typography>

      <TextField
        {...register('title')}
        placeholder='Title'
        required
        error={!!errors.title}
        helperText={errors.title?.message}
      />

      <TextField
        {...register('description')}
        placeholder='Description'
        rows={5}
        multiline
        error={!!errors.description}
        helperText={errors.description?.message}
      />
      <Stack>
        <Stack direction='row' gap={1} alignItems={'center'}>
          <AccessTimeIcon />
          <TextField
            {...register('duration')}
            placeholder='Duration'
            size='small'
            type='number'
            required
            error={!!errors.duration}
          />
          <Typography variant='subtitle2'>Minutes</Typography>
        </Stack>
        <Typography variant='subtitle2' color='error'>
          {errors.duration?.message}
        </Typography>
      </Stack>

      <Stack direction='row' alignItems='center' gap={1}>
        <ImageIcon />
        <Typography>{imagePreview}</Typography>
        <Button variant='contained' component='label'>
          Upload Image
          <input
            type='file'
            hidden
            accept='image/png,image/jpeg,image/webp'
            onChange={handleImageChange}
          />
        </Button>
      </Stack>

      <Typography variant='h4'>Ingredients</Typography>
      {errors.ingredients && (
        <Typography color='error'>{errors.ingredients.message}</Typography>
      )}

      {fields.map((field, index) => (
        <Stack
          key={field.id}
          direction={isMobile ? 'column' : 'row'}
          spacing={1}
          alignItems='center'
          sx={{ borderBottom: '1px dotted', paddingBottom: '15px' }}
        >
          <Stack width='100%' gap={1}>
            <Stack direction='row' width='100%' gap={1}>
              <TextField
                {...register(`ingredients.${index}.name`)}
                placeholder='Ingredient Name'
                size='small'
                fullWidth
                error={!!errors.ingredients?.[index]?.name}
              />
              {isMobile && fields.length > 1 && (
                <Button
                  variant='outlined'
                  color='error'
                  onClick={() => remove(index)}
                >
                  X
                </Button>
              )}
            </Stack>

            <Stack
              direction='row'
              alignItems='center'
              spacing={1}
              width={'100%'}
            >
              <TextField
                {...register(`ingredients.${index}.amount`)}
                sx={{ width: !isMobile ? '150px' : 'auto', minWidth: '100px' }}
                fullWidth
                placeholder='Amount'
                type='text'
                size='small'
                error={!!errors.ingredients?.[index]?.amount}
              />

              <Typography>X</Typography>

              <UnitSelector
                onUnitChange={(unit) => handleUnitChange(index, unit)}
                error={!!errors.ingredients?.[index]?.unit}
                register={register}
                index={index}
              />

              {!isMobile && fields.length > 1 && (
                <Button
                  variant='outlined'
                  color='error'
                  onClick={() => remove(index)}
                >
                  X
                </Button>
              )}
            </Stack>
            <Typography color='error'>
              {errors.ingredients?.[index]?.name?.message}
            </Typography>
            <Typography color='error'>
              {errors.ingredients?.[index]?.amount?.message}
            </Typography>
            <Typography color='error'>
              {errors.ingredients?.[index]?.unit?.message}
            </Typography>
          </Stack>
        </Stack>
      ))}

      <Button
        variant='contained'
        onClick={() => append({ name: '', amount: '', unit: '' })}
        sx={{ fontSize: '20px', width: '30px', margin: '0 auto' }}
      >
        +
      </Button>

      <Typography variant='h4'>Instructions</Typography>
      <TextField
        {...register('instructions')}
        placeholder='Instructions'
        rows={5}
        multiline
        error={!!errors.instructions}
        helperText={errors.instructions?.message}
      />

      <Button
        variant='contained'
        color='primary'
        onClick={handleSubmit(onSubmit)}
      >
        Submit Recipe
      </Button>
    </Paper>
  );
}

export default RecipeCreateForm;
