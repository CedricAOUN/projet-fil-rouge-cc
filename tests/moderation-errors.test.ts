import i18n from '@/i18n';
import { getFieldError, formatErrors } from '@/utils/formUtils';

afterEach(async () => { await i18n.changeLanguage('en'); });

test('server moderation errors use the selected French translation', async () => {
  await i18n.changeLanguage('fr');
  const error = { data: { errors: { name: ['Please remove inappropriate language.'] } } };
  expect(getFieldError(error, 'name')).toBe('Veuillez retirer les propos inappropriés.');
  expect(formatErrors(error, 'array')).toEqual(['Veuillez retirer les propos inappropriés.']);
  expect(getFieldError(undefined, 'name')).toBeUndefined();
});
