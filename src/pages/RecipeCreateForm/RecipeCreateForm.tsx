import React, { useMemo, useState, useRef } from 'react';
import {
  Button,
  Checkbox,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import UnitSelector from '@/components/UnitSelector/UnitSelector';
import { useForm, useFieldArray, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { UNIT_VALUES } from '@/constants/recipeFormConstants';
import './recipeCreateForm.css';
import {
  useCreateRecipeMutation,
  useEditRecipeMutation,
  useGetRecipeByIdQuery,
} from '@/api/recipeApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetCurrentUserQuery } from '@/api/authApi';
import PageErrorHandler from '../PageErrorHandler/PageErrorHandler';

type RecipeFormData = {
  title: string;
  description: string;
  instructions: string;
  is_premium: boolean;
  ingredients: {
    name: string;
    amount: string;
    unit: string;
  }[];
  image: File | null;
};

const schema: any = yup
  .object({
    title: yup.string().required('Title is required'),
    description: yup.string().defined(),
    instructions: yup.string().required('Instructions are required'),
    is_premium: yup.boolean().defined(),
    ingredients: yup
      .array()
      .of(
        yup
          .object({
            name: yup.string().required('Ingredient name is required'),
            amount: yup
              .number()
              .typeError('Amount must be a number')
              .required('Amount is required'),
            unit: yup
              .string()
              .oneOf(UNIT_VALUES, 'Unit is required')
              .required(),
          })
          .required(),
      )
      .min(1, 'At least one ingredient is required')
      .required(),
    image: yup.mixed<File>().nullable().defined(),
  })
  .required();

function RecipeCreateForm() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:900px)');
  const currentUser = useGetCurrentUserQuery().data;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Existing Recipe (for editting)
  const { id } = useParams<{ id: string }>();
  const { data: edittingRecipe, isLoading: isLoadingExistingRecipe } =
    useGetRecipeByIdQuery(id!, { skip: !id });

  const [createRecipe, { isLoading: isCreateLoading }] =
    useCreateRecipeMutation();
  const [editRecipe, { isLoading: isEditLoading }] = useEditRecipeMutation();
  const formValues = useMemo<RecipeFormData>(
    () => ({
      title: edittingRecipe?.title || '',
      description: edittingRecipe?.description || '',
      instructions: edittingRecipe?.instructions || '',
      is_premium: edittingRecipe?.is_premium || false,
      ingredients: edittingRecipe?.ingredients?.length
        ? edittingRecipe.ingredients.map((ingredient) => ({
            name: ingredient.name,
            amount: String(ingredient.quantity ?? ''),
            unit: ingredient.unit || 'unit',
          }))
        : [{ name: '', amount: '', unit: 'unit' }],
      image: null,
    }),
    [edittingRecipe],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<RecipeFormData>({
    resolver: yupResolver(schema) as Resolver<RecipeFormData>,
    values: formValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const [imageName, setImageName] = useState<string>('No Image Selected');
  const [imagePreview, setImagePreview] = useState<string | null>(
    edittingRecipe.image_url || null,
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageName(file.name);
      setValue('image', file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setImageName('No Image Selected');
    setImagePreview(null);
    setValue('image', null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = (data: RecipeFormData) => {
    if (edittingRecipe) {
      editRecipe({ data, id })
        .unwrap()
        .then((res) => navigate(`/recipe/${res.id}`));
    } else {
      createRecipe(data)
        .unwrap()
        .then((res) => navigate(`/recipe/${res.id}`));
    }
  };

  if (isLoadingExistingRecipe || isCreateLoading || isEditLoading) {
    return (
      <Stack direction={'row'} justifyContent={'center'} p={3}>
        <CircularProgress size={'50px'} />
      </Stack>
    );
  }

  if (edittingRecipe && edittingRecipe?.creator?.id !== currentUser?.id) {
    return <PageErrorHandler errorStatus={403} />;
  }

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
        {currentUser?.is_chef && (
          <Stack direction='row' gap={1} alignItems='center'>
            <Typography>Mark recipe as Premium</Typography>
            <Checkbox {...register('is_premium')} />
          </Stack>
        )}
      </Stack>

      <Stack direction='row' alignItems='center' gap='7px'>
        <ImageIcon />
        <Stack
          gap={1}
          width='100%'
          justifyContent='center'
          alignItems='center'
          border='1px dashed'
          padding='10px'
          borderRadius='5px'
        >
          <Typography textAlign='center'>{imageName}</Typography>
          {imagePreview && (
            <img className='image-preview' src={imagePreview} alt='Preview' />
          )}

          <Button variant='contained' component='label'>
            {imagePreview ? 'Change' : 'Upload'} image
            <input
              type='file'
              hidden
              accept='image/png,image/jpeg,image/webp'
              onChange={handleImageChange}
              ref={fileInputRef}
            />
          </Button>

          {imagePreview && (
            <Button
              variant='contained'
              sx={{ backgroundColor: 'error.main' }}
              onClick={handleImageRemove}
            >
              Remove Image
            </Button>
          )}
        </Stack>
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
          sx={{ borderBottom: '1px solid', pb: 2 }}
        >
          <Stack width='100%' gap={1}>
            <Typography>Ingredient {index + 1}</Typography>
            <Stack direction='row' gap={1}>
              <TextField
                {...register(`ingredients.${index}.name`)}
                placeholder='Ingredient Name'
                size='small'
                fullWidth
                error={!!errors.ingredients?.[index]?.name}
              />
              {isMobile && fields.length > 1 && (
                <Button onClick={() => remove(index)}>X</Button>
              )}
            </Stack>

            <Stack direction='row' spacing={1} alignItems='center'>
              <TextField
                {...register(`ingredients.${index}.amount`)}
                sx={{ width: !isMobile ? '150px' : 'auto', minWidth: '100px' }}
                fullWidth
                placeholder='Amount'
                size='small'
                error={!!errors.ingredients?.[index]?.amount}
              />

              <Typography>X</Typography>

              <UnitSelector
                error={errors.ingredients?.[index]?.unit}
                control={control}
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
        {edittingRecipe ? 'Confirm' : 'Submit Recipe'}
      </Button>
    </Paper>
  );
}

export default RecipeCreateForm;
