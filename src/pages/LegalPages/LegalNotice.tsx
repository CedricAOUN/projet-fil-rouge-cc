import { Link, Typography } from '@mui/material';
import LegalPageLayout, { type LegalSection } from '@/components/Legal/LegalPageLayout';

const P = ({ children }) => <Typography>{children}</Typography>;

export default function LegalNotice() {
  const sections: LegalSection[] = [
    { id: 'edition', title: '1. Édition du site', content: <P>MealMosaic est un projet étudiant édité par [À COMPLÉTER — nom ou raison sociale, forme juridique, capital social le cas échéant, adresse du siège ou domicile professionnel]. Immatriculation : [À COMPLÉTER — RCS/RNE, SIREN/SIRET]. Numéro de TVA intracommunautaire : [À COMPLÉTER ou « non applicable »].</P> },
    { id: 'publication', title: '2. Direction de la publication', content: <P>Directeur ou directrice de la publication : [À COMPLÉTER — nom et qualité]. Contact : [À COMPLÉTER — adresse électronique et numéro de téléphone professionnel].</P> },
    { id: 'hebergement', title: '3. Hébergement', content: <P>Le frontend, l’API, la base de données et les fichiers sont hébergés par [À COMPLÉTER — raison sociale de chaque hébergeur, adresse et téléphone]. L’emplacement géographique des données doit être précisé après vérification : [À COMPLÉTER].</P> },
    { id: 'propriete', title: '4. Propriété intellectuelle', content: <P>La structure, la marque, les textes et éléments graphiques propres à MealMosaic sont protégés sous réserve des droits des tiers. Toute reproduction excédant les exceptions légales nécessite une autorisation. Les utilisateurs conservent leurs droits sur leurs contributions et accordent uniquement la licence définie dans les CGU.</P> },
    { id: 'signalement', title: '5. Contact et signalement', content: <P>Pour signaler un contenu manifestement illicite, une atteinte à des droits ou un problème technique, écrivez à [À COMPLÉTER — adresse électronique] en indiquant l’URL concernée, le motif et les éléments permettant d’examiner la demande. Pour les données personnelles, consultez la <Link href='/confidentialite'>politique de confidentialité</Link>.</P> },
    { id: 'credits', title: '6. Crédits', content: <P>Conception et développement : [À COMPLÉTER]. Crédits des photographies, vidéos, polices, bibliothèques et autres ressources : [À COMPLÉTER après inventaire des licences].</P> },
  ];

  return <LegalPageLayout title='Mentions légales' description='Informations relatives à l’éditeur, à l’hébergement et aux droits applicables au site MealMosaic.' sections={sections} />;
}
