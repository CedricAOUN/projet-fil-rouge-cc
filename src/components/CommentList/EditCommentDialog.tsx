import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import React from 'react';

function EditCommentDialog({
  open,
  onClose,
  onConfirm,
  title,
  content,
  onContentChange,
  error,
  isSaving = false,
}: {
  open: boolean;
  error?: string;
  isSaving?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
  onContentChange: (newContent: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={isSaving ? undefined : onClose} fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          multiline
          fullWidth
          value={content}
          error={!!error}
          helperText={error}
          onChange={(e) => onContentChange(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={isSaving} onClick={onClose} color='primary'>{t("Cancel")}</Button>
        <Button disabled={isSaving} onClick={onConfirm} color='primary' autoFocus>{t("Confirm")}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditCommentDialog;
