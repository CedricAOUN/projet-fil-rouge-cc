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
      content: <Typography>{t("The data controller is [TO COMPLETE — name or business name, legal form, postal address, and contact email address].")}</Typography>,
    },
    {
      id: 'donnees',
      title: t("2. Data processed"),
      content: list([
        t("Account and authentication: username, email address, hashed password, login tokens, and account creation date."),
        t("Optional Google sign-in: Google identifier, verified email address, first and last names, and profile photo supplied by Google according to the account’s settings."),
        t("Public profile: username, first and last names, biography, avatar, chef role, and update dates. Email addresses and favorites are not public."),
        t("Contributions: recipes, ingredients, instructions, images, comments, likes, favorites, courses, content, and associated videos."),
        t("Subscription: Stripe customer and subscription identifiers, plan, status, renewal date, and the last four digits of the payment method when supplied by Stripe. MealMosaic does not receive full card numbers."),
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
        t("Managing subscriptions, payments, and transactional messages: performance of the contract and compliance with applicable accounting and tax obligations."),
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
            t("Stripe, for payment and technical subscription management;"),
            t("Resend or [TO COMPLETE — provider actually configured], for sending transactional emails;"),
            t("Groq, for generating requested AI suggestions;"),
            t("[TO COMPLETE — hosting provider, database, storage, and hosting countries]."),
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
          <Typography>{t("Account data and contributions are retained while the account is in use, then deleted or archived according to the following schedule: [TO COMPLETE — operational retention periods, backups, and inactive accounts].")}</Typography>
          <Typography>{t("Records needed for billing are archived for the applicable statutory period. Security logs, tokens, deleted files, AI suggestions, and requests to exercise rights follow these retention periods: [TO COMPLETE].")}</Typography>
        </>
      ),
    },
    {
      id: 'transferts',
      title: t("6. Transfers outside the European Economic Area"),
      content: <Typography>{t("Google, Stripe, Resend, and Groq may process some data outside the European Economic Area. The countries concerned, transfer mechanisms, and contractual safeguards must be verified and specified here before production deployment: [TO COMPLETE].")}</Typography>,
    },
    {
      id: 'traceurs',
      title: t("7. Local storage and trackers"),
      content: (
        <>
          <Typography>
            <Trans i18nKey="MealMosaic uses browser local storage to retain the authentication token (<code>token</code>) and the light or dark display preference (<code>theme-mode</code>). These items provide the requested features and are not used for advertising." components={{ code: <code /> }} />
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
          <Typography>{t("Send your request to [TO COMPLETE — GDPR contact email address]. Proof of identity may be requested only when necessary to prevent disclosure to a third party. As the “Delete Account” button is not yet operational in this student project, requests must be sent to this address.")}</Typography>
          <Typography>
            <Trans i18nKey="You may also lodge a complaint with the <authority>CNIL</authority>." components={{ authority: <Link href='https://www.cnil.fr/' target='_blank' rel='noreferrer' /> }} />
          </Typography>
        </>
      ),
    },
    {
      id: 'securite',
      title: t("9. Security and changes"),
      content: <Typography>{t("MealMosaic applies measures intended to limit unauthorized access, including password hashing and token authentication. As no system guarantees absolute security, measures, backup procedures, and incident contacts must be documented before production deployment: [TO COMPLETE]. Material changes to this policy will be communicated appropriately.")}</Typography>,
    },
  ];

  return <LegalPageLayout title={t("Privacy and tracking policy")} description={t("This policy explains how MealMosaic processes the personal data necessary to operate the service.")} sections={sections} />;
}
