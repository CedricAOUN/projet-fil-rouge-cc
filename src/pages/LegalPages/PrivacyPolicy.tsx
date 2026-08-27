import { Link, Typography } from '@mui/material';
import LegalPageLayout, { type LegalSection } from '@/components/Legal/LegalPageLayout';

const list = (items: string[]) => (
  <Typography component='div'>
    <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
  </Typography>
);

export default function PrivacyPolicy() {
  const sections: LegalSection[] = [
    {
      id: 'responsable',
      title: '1. Responsable du traitement',
      content: <Typography>Le responsable du traitement est [À COMPLÉTER — nom ou raison sociale, forme juridique, adresse postale et adresse électronique de contact].</Typography>,
    },
    {
      id: 'donnees',
      title: '2. Données traitées',
      content: list([
        'Compte et authentification : pseudonyme, adresse électronique, mot de passe haché, jetons de connexion et date de création du compte.',
        'Connexion Google facultative : identifiant Google, adresse électronique vérifiée, nom, prénom et photo de profil transmis par Google selon les choix du compte.',
        'Profil public : pseudonyme, prénom, nom, biographie, avatar, rôle de chef et dates de mise à jour. L’adresse électronique et les favoris ne sont pas publics.',
        'Contributions : recettes, ingrédients, instructions, images, commentaires, mentions « j’aime », favoris, cours, contenus et vidéos associés.',
        'Abonnement : identifiants client et abonnement Stripe, formule, statut, échéance et quatre derniers chiffres du moyen de paiement lorsqu’ils sont fournis par Stripe. MealMosaic ne reçoit pas le numéro complet de carte.',
        'Fonctionnement et sécurité : journaux techniques, adresse IP, agent utilisateur et informations nécessaires à la prévention des abus et au diagnostic des erreurs.',
        'Assistance par IA : contenu de la recette nécessaire à la génération d’une suggestion, ainsi que la suggestion enregistrée.',
      ]),
    },
    {
      id: 'finalites',
      title: '3. Finalités et bases juridiques',
      content: list([
        'Créer et administrer le compte, authentifier l’utilisateur et fournir les recettes, favoris, cours et fonctions communautaires : exécution du service demandé et des CGU.',
        'Publier les informations de profil et contenus choisis par l’utilisateur : exécution du service et intérêt légitime à faire fonctionner la communauté.',
        'Gérer les abonnements, paiements et messages transactionnels : exécution du contrat et respect des obligations comptables et fiscales applicables.',
        'Produire une suggestion d’IA à la demande : exécution du service demandé.',
        'Sécuriser le site, prévenir la fraude et défendre les droits de l’éditeur : intérêt légitime.',
        'Respecter les demandes des autorités et les obligations légales : obligation légale.',
      ]),
    },
    {
      id: 'destinataires',
      title: '4. Destinataires et prestataires',
      content: (
        <>
          <Typography>Les données sont accessibles aux personnes habilitées du projet et, selon la fonctionnalité utilisée, aux prestataires suivants :</Typography>
          {list([
            'Google, pour la connexion facultative avec un compte Google ;',
            'Stripe, pour le paiement et la gestion technique des abonnements ;',
            'Resend ou [À COMPLÉTER — fournisseur réellement configuré], pour l’envoi des courriels transactionnels ;',
            'Groq, pour générer les suggestions d’IA demandées ;',
            '[À COMPLÉTER — hébergeur, base de données, stockage et pays d’hébergement].',
          ])}
          <Typography>Les profils, recettes, commentaires et contenus désignés comme publics sont visibles par les visiteurs du site.</Typography>
        </>
      ),
    },
    {
      id: 'conservation',
      title: '5. Durées de conservation',
      content: (
        <>
          <Typography>Les données du compte et les contributions sont conservées pendant l’utilisation du compte, puis supprimées ou archivées selon le calendrier suivant : [À COMPLÉTER — durées opérationnelles, sauvegardes et comptes inactifs].</Typography>
          <Typography>Les pièces nécessaires à la facturation sont archivées pendant la durée légale applicable. Les journaux de sécurité, jetons, fichiers supprimés, suggestions d’IA et demandes d’exercice de droits suivent les durées suivantes : [À COMPLÉTER].</Typography>
        </>
      ),
    },
    {
      id: 'transferts',
      title: '6. Transferts hors de l’Espace économique européen',
      content: <Typography>Google, Stripe, Resend et Groq peuvent traiter certaines données hors de l’Espace économique européen. Les pays concernés, mécanismes de transfert et garanties contractuelles doivent être vérifiés et indiqués ici avant mise en production : [À COMPLÉTER].</Typography>,
    },
    {
      id: 'traceurs',
      title: '7. Stockage local et traceurs',
      content: (
        <>
          <Typography>MealMosaic utilise le stockage local du navigateur pour conserver le jeton d’authentification (<code>token</code>) et la préférence d’affichage clair ou sombre (<code>theme-mode</code>). Ces éléments servent à fournir les fonctions demandées et ne sont pas utilisés à des fins publicitaires.</Typography>
          <Typography>La connexion Google et le paiement Stripe peuvent utiliser leurs propres mécanismes techniques lorsque l’utilisateur ouvre ces services. Aucun outil d’analyse d’audience ou de publicité n’a été identifié dans la version actuelle. Cette affirmation doit être revue après chaque ajout de service tiers.</Typography>
        </>
      ),
    },
    {
      id: 'droits',
      title: '8. Vos droits',
      content: (
        <>
          <Typography>Selon votre situation, vous pouvez demander l’accès, la rectification, l’effacement, la limitation ou la portabilité de vos données, et vous opposer aux traitements fondés sur l’intérêt légitime.</Typography>
          <Typography>Adressez votre demande à [À COMPLÉTER — adresse électronique RGPD]. Une preuve d’identité pourra être demandée uniquement si elle est nécessaire pour éviter une divulgation à un tiers. Le bouton « Supprimer le compte » n’étant pas encore opérationnel dans ce projet étudiant, les demandes doivent être envoyées à cette adresse.</Typography>
          <Typography>Vous pouvez également déposer une réclamation auprès de la <Link href='https://www.cnil.fr/' target='_blank' rel='noreferrer'>CNIL</Link>.</Typography>
        </>
      ),
    },
    {
      id: 'securite',
      title: '9. Sécurité et modifications',
      content: <Typography>MealMosaic applique des mesures destinées à limiter les accès non autorisés, notamment le hachage des mots de passe et l’authentification par jeton. Aucun système ne garantissant une sécurité absolue, les mesures, procédures de sauvegarde et contacts en cas d’incident doivent être documentés avant mise en production : [À COMPLÉTER]. Toute modification importante de cette politique sera signalée par un moyen approprié.</Typography>,
    },
  ];

  return <LegalPageLayout title='Politique de confidentialité et traceurs' description='Cette politique explique comment MealMosaic traite les données personnelles nécessaires au fonctionnement du service.' sections={sections} />;
}
