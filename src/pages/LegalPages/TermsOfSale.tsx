import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import LegalPageLayout, { type LegalSection } from '@/components/Legal/LegalPageLayout';

export default function TermsOfSale() {
  const { t } = useTranslation();
  const sections: LegalSection[] = [
    { id: 'section-1', title: t("1. Student demonstration"), content: <Typography>{t("MealMosaic is a final-year student project published by Cedric AOUN. All premium subscriptions currently use Stripe sandbox mode. No real payment is collected and the displayed prices are demonstration values, not an offer to purchase a paid service.")}</Typography> },
    { id: 'section-2', title: t("2. Plans and simulated checkout"), content: <Typography>{t("The Home Cook, Sous Chef, and Master Chef plans demonstrate access to different features and roles. Checkout, billing cycles, subscription statuses, and renewal dates are simulated. Use only Stripe test payment details; do not enter real card details.")}</Typography> },
    { id: 'section-3', title: t("3. Test access and account closure"), content: <Typography>{t("Demonstration access may be reset, changed, or discontinued. There is currently no self-service subscription cancellation feature. Because no real payment is taken, simulated renewals do not create real charges. For account closure or help, contact Cedric.j.aoun@gmail.com.")}</Typography> },
    { id: 'section-4', title: t("4. Personal data"), content: <Typography>{t("Sandbox payment processing does not make account data anonymous. The privacy policy still applies to account information, public contributions, transactional emails, and optional Analytics.")}</Typography> },
  ];
  return <LegalPageLayout title={t("Demo subscriptions — no real sales")} description={t("Information about simulated MealMosaic premium subscriptions.")} sections={sections} />;
}
