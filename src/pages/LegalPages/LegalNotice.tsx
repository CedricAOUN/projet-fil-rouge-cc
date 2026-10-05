import { Trans, useTranslation } from 'react-i18next';
import { Link, Typography } from '@mui/material';
import LegalPageLayout, { type LegalSection } from '@/components/Legal/LegalPageLayout';

const P = ({ children }) => <Typography>{children}</Typography>;

export default function LegalNotice() {
  const { t } = useTranslation();
  const sections: LegalSection[] = [
    { id: 'edition', title: t("1. Website publisher"), content: <P>{t("MealMosaic is a student project published by [TO COMPLETE — name or business name, legal form, share capital where applicable, registered office or professional address]. Registration: [TO COMPLETE — RCS/RNE, SIREN/SIRET]. EU VAT number: [TO COMPLETE or “not applicable”].")}</P> },
    { id: 'publication', title: t("2. Publication director"), content: <P>{t("Publication director: [TO COMPLETE — name and capacity]. Contact: [TO COMPLETE — email address and professional telephone number].")}</P> },
    { id: 'hebergement', title: t("3. Hosting"), content: <P>{t("The frontend, API, database, and files are hosted by [TO COMPLETE — business name, address, and telephone number of each hosting provider]. The geographical location of the data must be specified after verification: [TO COMPLETE].")}</P> },
    { id: 'propriete', title: t("4. Intellectual property"), content: <P>{t("The structure, brand, text, and graphics specific to MealMosaic are protected, subject to third-party rights. Reproduction beyond statutory exceptions requires permission. Users retain their rights to their contributions and grant only the license defined in the Terms of Use.")}</P> },
    { id: 'signalement', title: t("5. Contact and reporting"), content: <P>
            <Trans i18nKey="To report manifestly unlawful content, an infringement of rights, or a technical issue, write to [TO COMPLETE — email address], specifying the URL concerned, the reason, and the information needed to review the request. For personal data, see the <privacy>privacy policy</privacy>." components={{ privacy: <Link href='/confidentialite' /> }} />
          </P> },
    { id: 'credits', title: t("6. Credits"), content: <P>{t("Design and development: [TO COMPLETE]. Credits for photographs, videos, fonts, libraries, and other resources: [TO COMPLETE after reviewing licenses].")}</P> },
  ];

  return <LegalPageLayout title={t("Legal notice")} description={t("Information about the publisher, hosting, and rights applicable to the MealMosaic website.")} sections={sections} />;
}
