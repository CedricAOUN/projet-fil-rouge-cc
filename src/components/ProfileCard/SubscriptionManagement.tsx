import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useCancelSubscriptionMutation } from '@/api/authApi';
import type { AuthUser, CancelSubscriptionResponse } from '@/api/authApi';

export default function SubscriptionManagement({ user }: { user: AuthUser }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<CancelSubscriptionResponse | null>(null);
  const [cancelSubscription, { isLoading, error, reset }] = useCancelSubscriptionMutation();
  const subscription = user.subscription;
  const cancelled = !!result || subscription?.cancelled;

  if (!subscription || (!subscription.can_cancel && !cancelled)) return null;

  const endsAt = result?.ends_at || subscription.ends_at || subscription.current_period_end;
  const date = endsAt ? dayjs(endsAt).format('MMMM D, YYYY') : null;
  const emailSent = result?.email_sent ?? subscription.cancellation_email_sent;

  const handleCancel = async () => {
    if (isLoading) return;
    try {
      setResult(await cancelSubscription().unwrap());
      setOpen(false);
    } catch {
      // Keep the confirmation open so the user can retry.
    }
  };

  return <Stack spacing={2} sx={{ width: '100%', alignItems: 'center' }}>
    <Typography variant='h5' component='h2'>{t('Subscription')}</Typography>
    {cancelled ? <>
      <Typography textAlign='center'>{t('Your subscription will not renew. Your access remains available until {{date}}.', { date })}</Typography>
      {result?.email_sent && <Alert severity='success'>{t('A confirmation email has been sent.')}</Alert>}
      {!emailSent && <>
        <Alert severity='warning'>{t('Your subscription is cancelled, but the confirmation email could not be sent.')}</Alert>
        {error && <Alert severity='error'>{t('Unable to send the confirmation email. Please try again.')}</Alert>}
        <Button disabled={isLoading} onClick={handleCancel}>{isLoading ? t('Sending...') : t('Retry confirmation email')}</Button>
      </>}
    </> : <>
      {date && <Typography>{t('Your subscription renews on {{date}}.', { date })}</Typography>}
      <Button variant='outlined' color='error' onClick={() => { reset(); setOpen(true); }}>{t('Unsubscribe')}</Button>
    </>}
    <Dialog open={open} onClose={isLoading ? undefined : () => setOpen(false)} aria-labelledby='unsubscribe-title'>
      <DialogTitle id='unsubscribe-title'>{t('Unsubscribe')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{date
          ? t('Stop renewing your subscription? You will keep your access until {{date}}. We will send you a confirmation email.', { date })
          : t('Stop renewing your subscription? You will keep your access until the end of your billing period. We will send you a confirmation email.')}</DialogContentText>
        {error && <Alert severity='error' sx={{ mt: 2 }}>{t('Unable to cancel your subscription. Please try again.')}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button disabled={isLoading} onClick={() => setOpen(false)}>{t('Cancel')}</Button>
        <Button disabled={isLoading} color='error' onClick={handleCancel}>{isLoading ? t('Unsubscribing...') : t('Confirm unsubscribe')}</Button>
      </DialogActions>
    </Dialog>
  </Stack>;
}
