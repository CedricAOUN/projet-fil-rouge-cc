import ContentPanel from '@/components/Layout/ContentPanel';
import { Trans, useTranslation } from 'react-i18next';
import {
  Button,
  CircularProgress,
  Checkbox,
  FormControlLabel,
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

  const { data: planDetails, isLoading: isPlanDetailsLoading } =
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
          <Select
            fullWidth
            size='small'
            value={selectedTier}
            onChange={(e) => onTierSelect(e.target.value)}
          >
            <MenuItem value='premium'>{t("Sous Chef")}</MenuItem>
            <MenuItem value='chef'>{t("Master Chef")}</MenuItem>
          </Select>
          <Select
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
          {isPlanDetailsLoading ? (
            <Stack direction={'row'} justifyContent={'center'} p={3}>
              <CircularProgress size={'50px'} />
            </Stack>
          ) : (
            <>
              <Typography variant='body2' fontSize={18}>{t('Price now: {{price}}', { price: planDetails?.price })}
              </Typography>
              <Typography variant='body2' fontSize={18}>{t('Equivalent to {{price}}/month', { price: planDetails?.monthlyPrice ?? t('N/A') })}</Typography>
              <Typography variant='body2' color='text.secondary'>{t("You will be charged based on the selected billing cycle. This student version does not yet provide self-service cancellation.")}</Typography>
            </>
          )}
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
