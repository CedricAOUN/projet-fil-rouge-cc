import { Comment } from '@/types';
import {
  Typography,
  Paper,
  Stack,
  Box,
  Avatar,
  IconButton,
  TextField,
  Button,
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  useAddCommentMutation,
  useDeleteCommentMutation,
  useEditCommentMutation,
} from '@/api/recipeApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import SendIcon from '@mui/icons-material/Send';
import EditCommentDialog from './EditCommentDialog';
import { useGetCurrentUserQuery } from '@/api/authApi';

function CommentList({
  comments,
  recipeId,
}: {
  comments: Comment[];
  recipeId: string;
}) {
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [idToEdit, setIdToEdit] = useState<number | null>(null);
  const [newCommentContent, setNewCommentContent] = useState<string>('');
  const [editedCommentContent, setEditedCommentContent] = useState<string>('');
  const { data: currentUser } = useGetCurrentUserQuery();
  const currentUserId = currentUser?.id;
  const isPremiumUser = currentUser?.is_premium || false;

  if (!comments || comments.length === 0) {
    return (
      <Paper>
        <Typography variant='h4'>Comments</Typography>
        <Typography variant='subtitle1'>No comments available.</Typography>
      </Paper>
    );
  }

  const [addComment, { isLoading: isAdding }] = useAddCommentMutation();
  const [editComment, { isLoading: isEditing }] = useEditCommentMutation();
  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();

  const handleAddComment = async (content: string) => {
    setNewCommentContent(''); // Clear the input field after adding a comment
    addComment({ recipeId, content });
  };

  const handleEditComment = async (commentId: number, content: string) => {
    editComment({ commentId, content });
  };

  const handleDeleteComment = async (commentId: number) => {
    deleteComment({ commentId, recipeId });
  };

  return (
    <Stack gap={2}>
      <Typography variant='h4'>Comments</Typography>
      {isPremiumUser && (
        <Stack direction='row' alignItems='center' gap={2}>
          <TextField
            label='Add a comment'
            multiline
            fullWidth
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
          ></TextField>
          <Button
            color='primary'
            onClick={() => handleAddComment(newCommentContent)}
          >
            <SendIcon></SendIcon>
          </Button>
        </Stack>
      )}
      {comments.map((comment, index) => (
        <Paper key={index} sx={{ position: 'relative' }}>
          <Stack
            direction='row'
            alignItems='center'
            gap={2}
            padding={1}
            width='100%'
          >
            <Avatar
              alt={comment.creator.name}
              src={comment.creator.avatar_url}
            />
            <Stack>
              <Stack direction='row'>
                <Typography variant='h6' fontWeight='bold'>
                  {comment.creator.name}:
                </Typography>
              </Stack>
              <Typography variant='subtitle2'>{comment.content}</Typography>
              {comment.updated_at &&
                comment.updated_at !== comment.created_at && (
                  <Typography variant='caption' color='textSecondary'>
                    Edited on{' '}
                    {dayjs(comment.updated_at).format('MMM D, YYYY h:mm A')}
                  </Typography>
                )}
            </Stack>
            <Box flexGrow={1}>
              <Typography variant='subtitle2' textAlign='end'>
                {dayjs(comment?.created_at).format('MMM D, YYYY h:mm A')}
              </Typography>
            </Box>
          </Stack>
          {currentUserId === comment.creator.id && (
            <Stack direction='row' position='absolute' right={0} top={'2%'}>
              <IconButton
                color='primary'
                onClick={() => {
                  setIdToEdit(comment.id);
                  setEditedCommentContent(comment.content);
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                color='error'
                onClick={() => setIdToDelete(comment.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          )}
        </Paper>
      ))}
      <ConfirmationModal
        open={idToDelete !== null}
        onClose={() => setIdToDelete(null)}
        onConfirm={() => {
          setIdToDelete(null);
          handleDeleteComment(idToDelete); // Assuming you want to delete the first comment for demonstration
        }}
        title='Confirm Deletion'
        message='Are you sure you want to delete this comment?'
      />
      <EditCommentDialog
        open={idToEdit !== null}
        onClose={() => setIdToEdit(null)}
        onConfirm={() => {
          setIdToEdit(null);
          handleEditComment(idToEdit, editedCommentContent); // Assuming you want to edit the first comment for demonstration
        }}
        title='Edit Comment'
        content={editedCommentContent}
        onContentChange={(content) => setEditedCommentContent(content)}
      />
    </Stack>
  );
}

export default CommentList;
