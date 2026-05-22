export const formatErrors = (error: any, type: 'str' | 'array') => {
  const singleString =
    Object.values(error?.data?.errors || {})
      .flat()
      .join(' ') ||
    error?.data?.message ||
    'An error occurred';

  const fieldErrors = Object.values(error?.data?.errors || {}).flat();
  const arrayOfErrors =
    fieldErrors.length > 0
      ? fieldErrors
      : [error?.data?.message || 'An error occurred'];

  return type === 'str' ? singleString : arrayOfErrors;
};
