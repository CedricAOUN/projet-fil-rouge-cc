import { ButtonBase } from '@mui/material';
import { useTranslation } from 'react-i18next';
import './themeModeToggle.css';

export default function ThemeModeToggle({ currentTheme, onThemeToggle }: { currentTheme: 'light' | 'dark'; onThemeToggle: () => void }) {
  const { t } = useTranslation();
  return <ButtonBase type='button' disableRipple className={`track ${currentTheme === 'dark' ? 'track-night' : ''}`}
    onClick={onThemeToggle} aria-label={t('Dark mode')} aria-pressed={currentTheme === 'dark'}
    sx={{ flexShrink: 0, justifyContent: 'flex-start', borderRadius: '15px', width: 60, height: 30, '&:focus-visible': { outline: '3px solid', outlineColor: 'secondary.main', outlineOffset: 3 } }}>
    <span aria-hidden='true' className={`circle ${currentTheme === 'dark' ? 'crescent-moon' : ''}`} />
  </ButtonBase>;
}
