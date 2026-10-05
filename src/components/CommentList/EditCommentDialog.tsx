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
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
  onContentChange: (newContent: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          multiline
          fullWidth
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>{t("Cancel")}</Button>
        <Button onClick={onConfirm} color='primary' autoFocus>{t("Confirm")}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditCommentDialog;
