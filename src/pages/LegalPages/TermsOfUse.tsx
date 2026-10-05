import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import LegalPageLayout, { type LegalSection } from '@/components/Legal/LegalPageLayout';

const P = ({ children }) => <Typography>{children}</Typography>;

export default function TermsOfUse() {
  const { t } = useTranslation();
  const sections: LegalSection[] = [
    { id: 'objet', title: t("1. Purpose and acceptance"), content: <P>{t("These terms govern access to MealMosaic and use of its recipes, profiles, favorites, comments, courses, premium features, and AI suggestions. Creating an account constitutes acceptance of the applicable version of these Terms of Use.")}</P> },
    { id: 'compte', title: t("2. User account"), content: <P>{t("Registration is open to the public. No age-verification or parental-consent mechanism is currently implemented. Users provide accurate information, protect their credentials, and report unauthorized access to Cedric.j.aoun@gmail.com. Public profile information and contributions are described in the privacy policy.")}</P> },
    { id: 'usage', title: t("3. Rules of use"), content: <P>{t("Publishing content that is unlawful, misleading, hateful, dangerous, infringing, invasive of privacy, contains malware, or disrupts the service is prohibited. Automated extraction, bypassing access controls, and fraudulent use of offers are prohibited.")}</P> },
    { id: 'contenus', title: t("4. User-published content"), content: <P>{t("Users retain their rights to their recipes, images, comments, courses, and videos and must hold the necessary permissions. They grant Cedric AOUN a non-exclusive, royalty-free, worldwide license, limited to the publication period, to host, technically reproduce, and display their content to provide MealMosaic. Content may be removed if it violates these terms or the law.")}</P> },
    { id: 'premium', title: t("5. Premium access and roles"), content: <P>{t("Some recipes and courses require a role or simulated premium subscription. Premium checkout uses Stripe sandbox mode and does not collect real payments. Test access may be changed or reset for the demonstration. Attempts to bypass access controls may result in account suspension.")}</P> },
    { id: 'ia', title: t("6. AI-generated suggestions"), content: <P>{t("Suggestions are automatically generated from recipes through a third-party provider. They may be inaccurate, incomplete, or unsuitable. They do not constitute medical or nutritional advice or a guarantee of results. Users must check them before use.")}</P> },
    { id: 'securite-alimentaire', title: t("7. Food safety and allergies"), content: <P>{t("Recipes are supplied, among others, by users. MealMosaic does not guarantee the absence of allergens, accuracy of quantities, cooking times, or compliance with food safety requirements. Users must adapt recipes to their health needs, check ingredients, and follow food storage and cooking rules.")}</P> },
    { id: 'disponibilite', title: t("8. Availability and liability"), content: <P>{t("The project may be changed, interrupted, or unavailable, particularly for maintenance. To the extent permitted by law, the publisher is not liable for user-published content, decisions based on AI suggestions, or damage resulting from use contrary to these terms. Mandatory statutory warranties remain applicable.")}</P> },
    { id: 'suspension', title: t("9. Suspension, deletion, and reporting"), content: <P>{t("The publisher may remove content or suspend accounts for violations, security risks, or legal obligations, notifying users where possible. Report content or request account closure at Cedric.j.aoun@gmail.com. Password-based account deletion is available in the profile; Google-only accounts currently require an email request.")}</P> },
    { id: 'droit', title: t("10. Governing law"), content: <P>{t("These terms are governed by French law, subject to mandatory applicable rules. Questions and disputes may be sent to Cedric.j.aoun@gmail.com. Jurisdiction is determined by applicable law.")}</P> },
  ];

  return <LegalPageLayout title={t("Terms of Use")} description={t("Rules governing use of the MealMosaic website, accounts, and content.")} sections={sections} />;
}
