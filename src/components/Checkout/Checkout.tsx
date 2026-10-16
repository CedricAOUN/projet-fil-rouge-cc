import ContentPanel from '@/components/Layout/ContentPanel';
import { Trans, useTranslation } from 'react-i18next';
import {
  Button,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Link as MuiLink,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useGetPlanDetailsQuery } from '@/api/plansApi';
import { useState } from 'react';
import { useCheckoutMutation, useGetCurrentUserQuery } from '@/api/authApi';
import { getPremiumTiers } from '@/constants/premiumPlans';
import { Link as RouterLink } from 'react-router-dom';

function Checkout({ paymentSectionRef, selectedTier, onTierSelect }) {
  const { t } = useTranslation();
  const currentUserId = useGetCurrentUserQuery().data?.id;
  const isLoggedIn = Boolean(currentUserId);

  const [selectedBilling, setSelectedBilling] = useState('monthly');
  const [acceptedTermsFor, setAcceptedTermsFor] = useState<string | null>(null);
  const currentTermsKey = `${selectedTier}:${selectedBilling}`;
  const hasAcceptedTerms = acceptedTermsFor === currentTermsKey;

  const [checkout, { isLoading: isCheckoutLoading }] = useCheckoutMutation();
  const handleCheckout = () => {
    if (!hasAcceptedTerms) return;

    checkout({ product: selectedTier, interval: selectedBilling })
      .unwrap()
      .then((response) => {
        window.location.href = response.checkout_url;
      })
      .catch((error) => {
        console.error('Checkout error:', error);
      });
  };

  // Fetch chosen plan details
  const selectedPlan = getPremiumTiers(t).find((tier) => tier.id === selectedTier);
  const selectedPlanStripeId = selectedPlan?.stripePriceMap[selectedBilling];

  const { currentData: planDetails, isFetching: isPlanDetailsLoading } =
    useGetPlanDetailsQuery(selectedPlanStripeId);

  return (
    <>
      <Typography variant='h1' component='h2' ref={paymentSectionRef}>{t("Plan Selection")}</Typography>
      <Stack direction='row' width='100%' gap={2} mb={5} flexWrap='wrap'>
        <ContentPanel
          sx={{
            flexGrow: 1,
            gap: '10px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Stack direction='row' alignItems={'center'} gap={1}>
            <ReceiptIcon />
            <Typography variant='h6' component='h3'>{t("Subscription information")}</Typography>
          </Stack>
          <FormControl fullWidth size='small'>
            <InputLabel id='subscription-plan-label'>{t('Subscription plan')}</InputLabel>
            <Select
              labelId='subscription-plan-label'
              label={t('Subscription plan')}
              fullWidth
              size='small'
              value={selectedTier}
              onChange={(e) => onTierSelect(e.target.value)}
            >
              <MenuItem value='premium'>{t("Sous Chef")}</MenuItem>
              <MenuItem value='chef'>{t("Master Chef")}</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth size='small'>
            <InputLabel id='billing-cycle-label'>{t('Billing cycle')}</InputLabel>
            <Select
              labelId='billing-cycle-label'
              label={t('Billing cycle')}
              fullWidth
              size='small'
              value={selectedBilling}
              onChange={(e) => {
                setSelectedBilling(e.target.value);
              }}
            >
              <MenuItem value='monthly'>{t("Monthly")}</MenuItem>
              <MenuItem value='6_months'>{t("Every 6 Months")}</MenuItem>
              <MenuItem value='annual'>{t("Yearly")}</MenuItem>
            </Select>
          </FormControl>
          {isPlanDetailsLoading ? (
            <Stack direction={'row'} justifyContent={'center'} p={3}>
              <CircularProgress size={'50px'} />
            </Stack>
          ) : planDetails ? (
            <>
              <Typography variant='body2' fontSize={18}>{t('Price now: {{price}}', { price: planDetails?.price })}
              </Typography>
              <Typography variant='body2' fontSize={18}>{t('Equivalent to {{price}}/month', { price: planDetails?.monthlyPrice ?? t('N/A') })}</Typography>
            </>
          ) : <Typography role='alert' color='error'>{t('Price unavailable')}</Typography>}
          <Typography variant='body2' color='text.secondary'>{t('Billing follows the selected cycle. To stop renewal, open your profile and select Unsubscribe. Access continues until the end of the current billing period. Payments are simulated in Stripe sandbox mode.')}</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={hasAcceptedTerms}
                onChange={(event) =>
                  setAcceptedTermsFor(
                    event.target.checked ? currentTermsKey : null,
                  )
                }
              />
            }
            label={
              <Typography variant='body2'>
            <Trans i18nKey="I have read and accept the <terms>Terms of Sale and Subscription</terms>." components={{ terms: <MuiLink component={RouterLink} to='/conditions-vente' target='_blank' rel='noreferrer' /> }} />
          </Typography>
            }
          />
          <Button
            variant='contained'
            color='primary'
            onClick={handleCheckout}
            disabled={
              isCheckoutLoading ||
              isPlanDetailsLoading ||
              !planDetails ||
              !isLoggedIn ||
              !hasAcceptedTerms
            }
          >
            {isCheckoutLoading
              ? t("Processing...")
              : isLoggedIn
                ? t("Proceed to Checkout")
                : t("You must be logged in")}
          </Button>
        </ContentPanel>
      </Stack>
    </>
  );
}

export default Checkout;
