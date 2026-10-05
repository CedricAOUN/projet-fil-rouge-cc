import { Trans, useTranslation } from 'react-i18next';
import { Link, Typography } from '@mui/material';
import LegalPageLayout, { type LegalSection } from '@/components/Legal/LegalPageLayout';

const list = (items: string[]) => (
  <Typography component='div'>
    <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
  </Typography>
);

export default function PrivacyPolicy() {
  const { t } = useTranslation();
  const sections: LegalSection[] = [
    {
      id: 'responsable',
      title: t("1. Data controller"),
      content: <Typography>{t("The data controller is Cedric AOUN, non-professional publisher of this certification demonstration project. For privacy questions and rights requests, contact Cedric.j.aoun@gmail.com.")}</Typography>,
    },
    {
      id: 'donnees',
      title: t("2. Data processed"),
      content: list([
        t("Account and authentication: username, email address, hashed password, login tokens, and account creation date."),
        t("Optional Google sign-in: Google identifier, verified email address, first and last names, and profile photo supplied by Google according to the account’s settings."),
        t("Public profile: username, first and last names, biography, avatar, chef role, and update dates. Email addresses and favorites are not public."),
        t("Contributions: recipes, ingredients, instructions, images, comments, likes, favorites, courses, content, and associated videos."),
        t("Simulated subscriptions: Stripe sandbox customer and subscription identifiers, plan, status, and renewal date. No real payment is collected. Use only Stripe test payment details, never real card details."),
        t("Operation and security: technical logs, IP address, user agent, and information needed to prevent abuse and diagnose errors."),
        t("AI assistance: recipe content needed to generate a suggestion, together with the saved suggestion."),
      ]),
    },
    {
      id: 'finalites',
      title: t("3. Purposes and legal bases"),
      content: list([
        t("Creating and managing accounts, authenticating users, and providing recipes, favorites, courses, and community features: performance of the requested service and the Terms of Use."),
        t("Publishing profile information and content selected by users: performance of the service and legitimate interest in operating the community."),
        t("Managing simulated subscriptions and transactional emails: performance of the requested demonstration service. Google Analytics audience measurement: consent, which can be withdrawn at any time."),
        t("Producing an AI suggestion on request: performance of the requested service."),
        t("Securing the website, preventing fraud, and protecting the publisher’s rights: legitimate interest."),
        t("Complying with requests from authorities and legal obligations: legal obligation."),
      ]),
    },
    {
      id: 'destinataires',
      title: t("4. Recipients and service providers"),
      content: (
        <>
          <Typography>{t("Data is accessible to authorized project personnel and, depending on the feature used, the following providers:")}</Typography>
          {list([
            t("Google, for optional Google account sign-in and, with your consent, audience measurement through Google Analytics;"),
            t("Stripe, for simulated checkout and subscription management in sandbox mode;"),
            t("Resend, for sending transactional emails;"),
            t("Groq, for generating requested AI suggestions;"),
            t("Vercel, for frontend hosting and delivery, and Northflank, for the API, MySQL database, and uploaded images and videos in the Europe/West region. Seeded images and avatars may also be loaded directly from Unsplash and Pravatar; these requests disclose network information such as the visitor’s IP address to those providers."),
          ])}
          <Typography>{t("Profiles, recipes, comments, and content designated as public are visible to website visitors.")}</Typography>
        </>
      ),
    },
    {
      id: 'conservation',
      title: t("5. Retention periods"),
      content: (
        <>
          <Typography>{t("There is no automatic deletion of inactive accounts. Account data remains until deletion is requested or performed. Deleting an account also deletes associated database contributions through cascading deletion. MySQL backups are retained for up to 120 days and may contain previously deleted records during that period. Uploaded images and videos are not included in these backups. Database deletion does not automatically remove uploaded files.")}</Typography>
          <Typography>{t("Google Analytics is configured to retain event-level data for 2 months and user-level data for 14 months. These controls do not set a deletion deadline for standard aggregated reports. If Reset user data on new activity is enabled, new activity extends retention of the user identifier. That setting still needs verification. No automatic uploaded-file cleanup is implemented on account deletion. Additional retention periods for security and hosting logs, authentication tokens, and rights requests have not yet been verified for this demonstration. Contact Cedric.j.aoun@gmail.com for a deletion request or clarification. Sandbox records are not invoices for real sales.")}</Typography>
        </>
      ),
    },
    {
      id: 'transferts',
      title: t("6. Transfers outside the European Economic Area"),
      content: <Typography>{t("Vercel, Northflank, Google, Stripe, Resend, and Groq may involve processing outside the European Economic Area. The Northflank API and database deployment is in Europe/West; this does not mean all external providers process data exclusively in Europe. A complete review of provider processing locations and applicable transfer safeguards has not yet been completed for this demonstration. Questions may be sent to Cedric.j.aoun@gmail.com.")}</Typography>,
    },
    {
      id: 'traceurs',
      title: t("7. Local storage and trackers"),
      content: (
        <>
          <Typography>
            <Trans i18nKey="MealMosaic uses browser local storage for the authentication token (<code>token</code>), display preference (<code>theme-mode</code>), and language chosen through the footer toggle (<code>language</code>). Without a saved language choice, the browser preference is used. These items provide requested features and are not used for advertising." components={{ code: <code /> }} />
          </Typography>
          <Typography>{t("Google sign-in and Stripe payments may use their own technical mechanisms when users open these services. When configured, Google Analytics is used only with your consent to measure website traffic. No Analytics script or measurement event is loaded or sent before acceptance.")}</Typography>
          <Typography>
            <Trans i18nKey="Your acceptance or refusal is retained for six months in local storage (<code>analytics-consent</code>), along with its date and the consent version. If storage is unavailable, the choice applies only to the current visit. You can change it at any time through “Manage cookies” in the footer. Withdrawing consent disables collection and removes Google Analytics cookies accessible on this website; it does not delete data already transmitted." components={{ code: <code /> }} />
          </Typography>
        </>
      ),
    },
    {
      id: 'droits',
      title: t("8. Your rights"),
      content: (
        <>
          <Typography>{t("Depending on your circumstances, you may request access, rectification, erasure, restriction, or portability of your data, and object to processing based on legitimate interest.")}</Typography>
          <Typography>{t("Send rights requests to Cedric.j.aoun@gmail.com. Proof of identity may be requested only where necessary. Accounts with a local password can use Delete Account in their profile. Google-only accounts must currently request deletion by email because the confirmation dialog requires a local password.")}</Typography>
          <Typography>
            <Trans i18nKey="You may also lodge a complaint with the <authority>CNIL</authority>." components={{ authority: <Link href='https://www.cnil.fr/' target='_blank' rel='noreferrer' /> }} />
          </Typography>
        </>
      ),
    },
    {
      id: 'securite',
      title: t("9. Security and changes"),
      content: <Typography>{t("MealMosaic applies measures intended to limit unauthorized access, including password hashing and token authentication. MySQL backups are retained for up to 120 days; uploaded files are not backed up. No system guarantees absolute security. Report suspected unauthorized access or a security incident to Cedric.j.aoun@gmail.com. Material changes to this policy will be communicated appropriately.")}</Typography>,
    },
  ];

  return <LegalPageLayout title={t("Privacy and tracking policy")} description={t("This policy explains how MealMosaic processes the personal data necessary to operate the service.")} sections={sections} />;
}
