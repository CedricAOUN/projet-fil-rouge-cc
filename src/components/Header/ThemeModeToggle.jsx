import React from 'react';
import './themeModeToggle.css';

function ThemeModeToggle({ currentTheme, onThemeToggle }) {
  return (
    <div
      className={`track ${currentTheme === 'dark' ? 'track-night' : ''}`}
      onClick={onThemeToggle}
    >
      <div
        className={`circle ${currentTheme === 'dark' ? 'crescent-moon' : ''}`}
      ></div>
    </div>
  );
}

export default ThemeModeToggle;
