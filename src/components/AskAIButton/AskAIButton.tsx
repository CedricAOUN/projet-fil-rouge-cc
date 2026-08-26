import { useAskAIQuery } from '@/api/recipeApi';
import {
  Button,
  CircularProgress,
  Dialog,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';

function AskAIButton({ recipe }) {
  const [isOpen, setIsOpen] = useState(false);

  const { data: suggestion, isLoading } = useAskAIQuery(
    { id: recipe?.id },
    { skip: !isOpen },
  );

  const content = suggestion || recipe?.suggestion?.suggestion;

  return (
    <>
      <Button sx={{ height: 40 }} onClick={() => setIsOpen(true)}>
        Ask AI
      </Button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        fullWidth
        maxWidth='xl'
      >
        <Stack
          direction={'row'}
          width={'100%'}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <SmartToyIcon color='primary'></SmartToyIcon>
          <Typography variant='h5' color='primary'>
            AI Assisted Steps
          </Typography>
          <IconButton onClick={() => setIsOpen(false)}>
            <CloseIcon sx={{ fontSize: 24 }}></CloseIcon>
          </IconButton>
        </Stack>
        <Divider></Divider>
        {isLoading && (
          <Stack direction={'row'} justifyContent={'center'} p={3}>
            <CircularProgress size={'50px'} />
          </Stack>
        )}
        {!isLoading && <ReactMarkdown>{content}</ReactMarkdown>}
      </Dialog>
    </>
  );
}

export default AskAIButton;
