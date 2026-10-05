#!/usr/bin/env python3
"""Extract frontend i18n keys and add missing entries without replacing translations.

Run: python translations/update.py
Optional: --source PATH --output PATH
English entries default to their source text; French entries start empty.
Literal t('key'), i18n.t('key'), and Trans i18nKey attributes are supported.
Dynamic keys are reported for manual review; obsolete keys are retained.
"""

import argparse
import html
import json
import os
from pathlib import Path
import re
import tempfile


PROJECT = Path(__file__).resolve().parent.parent
TOKEN = re.compile(
    r"(?P<comment>//[^\n]*|/\*[\s\S]*?\*/)"
    r"|(?P<string>'(?:\\[\s\S]|[^'\\])*'|\"(?:\\[\s\S]|[^\"\\])*\"|`(?:\\[\s\S]|[^`\\])*`)"
    r"|(?P<identifier>[A-Za-z_$][\w$]*)|(?P<symbol>[^\s])"
)
ESCAPE = re.compile(r"\\(?:\r\n|\n|\r|u\{[0-9a-fA-F]+\}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|.)")


def decode_string(raw, jsx=False):
    value = raw[1:-1]
    if jsx:
        return html.unescape(value)
    if raw.startswith('`') and '${' in value:
        return None

    def decode(match):
        escaped = match.group()[1:]
        if escaped in ('\n', '\r', '\r\n'):
            return ''
        if escaped.startswith('u{'):
            return chr(int(escaped[2:-1], 16))
        if escaped.startswith(('u', 'x')):
            return chr(int(escaped[1:], 16))
        return {'n': '\n', 'r': '\r', 't': '\t', 'b': '\b',
                'f': '\f', 'v': '\v', '0': '\0'}.get(escaped, escaped)

    return ESCAPE.sub(decode, value)


def extract(source):
    keys = set()
    plural_keys = set()
    warnings = []
    for path in sorted(source.rglob('*')):
        if path.suffix not in ('.ts', '.tsx', '.js', '.jsx') or not path.is_file():
            continue
        text = path.read_text(encoding='utf-8-sig')
        tokens = [token for token in TOKEN.finditer(text) if token.lastgroup != 'comment']
        for index, token in enumerate(tokens):
            name = token.group()
            if name not in ('t', 'i18nKey') or index + 2 >= len(tokens):
                continue
            following = tokens[index + 1].group()
            if (name == 't' and following != '(') or (name == 'i18nKey' and following != '='):
                continue
            argument_index = index + 2
            jsx = name == 'i18nKey' and tokens[argument_index].group() != '{'
            if name == 'i18nKey' and not jsx:
                argument_index += 1
            if argument_index >= len(tokens):
                continue
            argument = tokens[argument_index]
            end_index = argument_index + 1
            expected = {',', ')'} if name == 't' else ({'/', '>', 'components', 'defaults', 'values', 'count', 't', 'i18n', 'ns', 'children'} if jsx else {'}'})
            literal = argument.lastgroup == 'string'
            # Reject computed expressions such as t('prefix' + value).
            if literal and name == 't' and (end_index >= len(tokens) or tokens[end_index].group() not in expected):
                literal = False
            if literal and name == 'i18nKey' and not jsx and tokens[end_index].group() != '}':
                literal = False
            key = decode_string(argument.group(), jsx=jsx) if literal else None
            if not key:
                line = text.count('\n', 0, token.start()) + 1
                warnings.append(f'{path}:{line}: dynamic or empty {name} key skipped')
                continue
            keys.add(key)
            if name == 't':
                depth = 1
                cursor = index + 2
                while cursor < len(tokens) and depth:
                    current = tokens[cursor].group()
                    if current == '(':
                        depth += 1
                    elif current == ')':
                        depth -= 1
                    if current in ('count', "'count'", '"count"') and cursor + 1 < len(tokens) and tokens[cursor + 1].group() in (':', ',', '}'):
                        plural_keys.add(key)
                    cursor += 1
    return keys, plural_keys, warnings


def unique_object(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError(f'Duplicate JSON key: {key}')
        result[key] = value
    return result


def read_catalog(path):
    if not path.exists():
        return {}
    catalog = json.loads(path.read_text(encoding='utf-8-sig'), object_pairs_hook=unique_object)
    if not isinstance(catalog, dict):
        raise ValueError(f'{path} must contain a JSON object')
    return catalog


def write_catalog(path, catalog):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(mode='w', encoding='utf-8', newline='\n',
                                         dir=path.parent, delete=False) as handle:
            temporary = Path(handle.name)
            json.dump(catalog, handle, ensure_ascii=False, indent=2)
            handle.write('\n')
        os.replace(temporary, path)
    finally:
        if temporary is not None and temporary.exists():
            temporary.unlink()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, default=PROJECT / 'src')
    parser.add_argument('--output', type=Path, default=PROJECT / 'translations')
    args = parser.parse_args()
    if not args.source.is_dir():
        parser.error(f'Source directory does not exist: {args.source}')
    keys, plural_keys, warnings = extract(args.source)
    # Validate both files before changing either one.
    paths = {language: args.output / f'{language}.json' for language in ('en', 'fr')}
    catalogs = {language: read_catalog(path) for language, path in paths.items()}
    for language, path in paths.items():
        catalog = catalogs[language]
        additions = {key: key if language == 'en' else '' for key in keys}
        categories = ('one', 'other') if language == 'en' else ('one', 'many', 'other')
        for key in plural_keys:
            for category in categories:
                additions[f'{key}_{category}'] = key if language == 'en' else ''
        missing = sorted(key for key in additions if key not in catalog)
        for key in missing:
            catalog[key] = additions[key]
        if missing or not path.exists():
            write_catalog(path, catalog)
        print(f'{path}: added {len(missing)} keys; {len(catalog)} total')
    for warning in warnings:
        print(f'Warning: {warning}')


if __name__ == '__main__':
    main()
