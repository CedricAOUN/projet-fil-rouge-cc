# Translation catalogs

Run from the project root with Python 3 (no additional Python packages required):

```sh
python translations/update.py
```

On Windows with the Python launcher, use `py -3 translations/update.py`.

The script scans `src` for literal `t(...)` calls and `Trans` `i18nKey` attributes.
It creates or updates `translations/en.json` and `translations/fr.json`:

- New English entries contain their source text.
- New French entries are empty, ready for translation.
- Existing values, including empty values and obsolete keys, are never replaced or deleted.
- Repeated runs with no new keys leave the files unchanged.
- Calls using `count` also generate English and French plural forms.
- Dynamic keys are reported for manual review. Keep keys literal so they can be extracted.
- Invalid catalogs or duplicate JSON keys cause the script to stop rather than replace a catalog.

For another source or output directory:

```sh
python translations/update.py --source src --output translations
```

The frontend loads these catalogs through `src/i18n.ts`. Empty French entries fall
back to English. The footer language toggle saves the selected language locally;
New visitors use the first supported browser language (English or French), with
English as the fallback. Only interacting with the toggle saves an override.
