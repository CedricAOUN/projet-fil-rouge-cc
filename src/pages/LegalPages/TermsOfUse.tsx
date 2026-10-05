import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import LegalPageLayout, { type LegalSection } from '@/components/Legal/LegalPageLayout';

const P = ({ children }) => <Typography>{children}</Typography>;

export default function TermsOfUse() {
  const { t } = useTranslation();
  const sections: LegalSection[] = [
    { id: 'objet', title: t("1. Purpose and acceptance"), content: <P>{t("These terms govern access to MealMosaic and use of its recipes, profiles, favorites, comments, courses, premium features, and AI suggestions. Creating an account constitutes acceptance of the applicable version of these Terms of Use.")}</P> },
    { id: 'compte', title: t("2. User account"), content: <P>{t("Users provide accurate information, protect their credentials, and notify [TO COMPLETE — contact] of unauthorized access. They are responsible for actions performed through their accounts. Some profile information and contributions are public, as described in the privacy policy.")}</P> },
    { id: 'usage', title: t("3. Rules of use"), content: <P>{t("Publishing content that is unlawful, misleading, hateful, dangerous, infringing, invasive of privacy, contains malware, or disrupts the service is prohibited. Automated extraction, bypassing access controls, and fraudulent use of offers are prohibited.")}</P> },
    { id: 'contenus', title: t("4. User-published content"), content: <P>{t("Users retain their rights to their recipes, images, comments, courses, and videos. They warrant that they hold the necessary rights. They grant [TO COMPLETE — publisher] a non-exclusive, royalty-free, worldwide license, limited to the period of publication, to host, technically reproduce, and display this content to provide MealMosaic. Content may be removed when it violates these terms or the law.")}</P> },
    { id: 'premium', title: t("5. Premium access and roles"), content: <P>{t("Some recipes and courses are reserved for members with the required role or subscription. Financial and renewal conditions are governed by the Terms of Sale. Attempts to bypass these restrictions may result in account suspension.")}</P> },
    { id: 'ia', title: t("6. AI-generated suggestions"), content: <P>{t("Suggestions are automatically generated from recipes through a third-party provider. They may be inaccurate, incomplete, or unsuitable. They do not constitute medical or nutritional advice or a guarantee of results. Users must check them before use.")}</P> },
    { id: 'securite-alimentaire', title: t("7. Food safety and allergies"), content: <P>{t("Recipes are supplied, among others, by users. MealMosaic does not guarantee the absence of allergens, accuracy of quantities, cooking times, or compliance with food safety requirements. Users must adapt recipes to their health needs, check ingredients, and follow food storage and cooking rules.")}</P> },
    { id: 'disponibilite', title: t("8. Availability and liability"), content: <P>{t("The project may be changed, interrupted, or unavailable, particularly for maintenance. To the extent permitted by law, the publisher is not liable for user-published content, decisions based on AI suggestions, or damage resulting from use contrary to these terms. Mandatory statutory warranties remain applicable.")}</P> },
    { id: 'suspension', title: t("9. Suspension, deletion, and reporting"), content: <P>{t("The publisher may hide content or suspend an account in the event of a violation, security risk, or legal obligation, notifying the user where possible. To report content or request account closure, contact [TO COMPLETE — email address]. Self-service deletion is not yet available in this student version.")}</P> },
    { id: 'droit', title: t("10. Governing law"), content: <P>{t("These terms are governed by French law. Mandatory consumer protection rules and required amicable dispute resolution procedures remain applicable. Competent court and contact procedure: [TO COMPLETE before production deployment].")}</P> },
  ];

  return <LegalPageLayout title={t("Terms of Use")} description={t("Rules governing use of the MealMosaic website, accounts, and content.")} sections={sections} />;
}
