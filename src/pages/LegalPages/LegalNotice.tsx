import { Trans, useTranslation } from 'react-i18next';
import { Link, Typography } from '@mui/material';
import LegalPageLayout, { type LegalSection } from '@/components/Legal/LegalPageLayout';

const P = ({ children }) => <Typography>{children}</Typography>;

export default function LegalNotice() {
  const { t } = useTranslation();
  const sections: LegalSection[] = [
    { id: 'edition', title: t("1. Website publisher"), content: <P>{t("MealMosaic is a final-year certification demonstration project published personally by Cedric AOUN at https://projet-fil-rouge-cc.vercel.app/. It is not operated by a school. Premium subscriptions use Stripe sandbox mode; no real payment is collected.")}</P> },
    { id: 'publication', title: t("2. Publication director"), content: <P>{t("Publication director: Cedric AOUN, project publisher. Contact: Cedric.j.aoun@gmail.com.")}</P> },
    { id: 'hebergement', title: t("3. Hosting"), content: <P>{t("The frontend is hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, United States (privacy@vercel.com). The Laravel API, MySQL database, and uploaded files are hosted by Northflank Ltd., 20–22 Wenlock Road, London N1 7GU, United Kingdom (legal@northflank.com), in the Europe/West deployment region. Vercel uses a distributed delivery network. Exact delivery locations and provider telephone contacts have not been verified for this demonstration. The provider email contacts above can be used for hosting enquiries.")}</P> },
    { id: 'propriete', title: t("4. Intellectual property"), content: <P>{t("The structure, brand, text, and graphics specific to MealMosaic are protected, subject to third-party rights. Reproduction beyond statutory exceptions requires permission. Users retain their rights to their contributions and grant only the license defined in the Terms of Use.")}</P> },
    { id: 'signalement', title: t("5. Contact and reporting"), content: <P>
            <Trans i18nKey="To report manifestly unlawful content, an infringement of rights, or a technical issue, write to Cedric.j.aoun@gmail.com, specifying the URL concerned, the reason, and the information needed to review the request. For personal data, see the <privacy>privacy policy</privacy>." components={{ privacy: <Link href='/confidentialite' /> }} />
          </P> },
    { id: 'credits', title: t("6. Credits"), content: <P>{t("Design and development: Cedric AOUN. Seeded demonstration text includes AI-generated content. Seeded recipe photographs come from Unsplash and are used under its license (https://unsplash.com/license). The repository also contains Pravatar URLs for seeded profile avatars. Other images and videos are supplied by users, who must hold the necessary rights. The AI tools used for seeded text and their usage terms have not been inventoried for this demonstration. No blanket license is granted over third-party assets.")}</P> },
  ];

  return <LegalPageLayout title={t("Legal notice")} description={t("Information about the publisher, hosting, and rights applicable to the MealMosaic website.")} sections={sections} />;
}
