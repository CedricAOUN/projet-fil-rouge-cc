import { t } from '@/i18n';
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

type ApiValidationError = { data?: { errors?: Record<string, string[] | string>; message?: string } };

export const getFieldError = (error: unknown, field: string): string | undefined => {
  const message = (error as ApiValidationError)?.data?.errors?.[field];
  const first = Array.isArray(message) ? message[0] : message;
  return typeof first === 'string' ? t(first) : undefined;
};

export function applyValidationErrors<T extends FieldValues>(error: unknown, setError: UseFormSetError<T>) {
  const fields = Object.keys((error as ApiValidationError)?.data?.errors || {});
  for (const field of fields) {
    const formField = field.replace(/^(ingredients\.\d+)\.quantity$/, '$1.amount');
    setError(formField as Path<T>, { type: 'server', message: getFieldError(error, field) });
  }
  if (!fields.length) setError('root.server', { type: 'server', message: t('Unable to save. Please try again.') });
}
export const formatErrors = (error: unknown, type: 'str' | 'array') => {
  const singleString =
    Object.values((error as ApiValidationError)?.data?.errors || {})
      .flat().map(message => t(String(message)))
      .join(' ') ||
    (error as ApiValidationError)?.data?.message ||
    t("An error occurred");

  const fieldErrors = Object.values((error as ApiValidationError)?.data?.errors || {}).flat().map(message => t(String(message)));
  const arrayOfErrors =
    fieldErrors.length > 0
      ? fieldErrors
      : [(error as ApiValidationError)?.data?.message || t("An error occurred")];

  return type === 'str' ? singleString : arrayOfErrors;
};
