export function unwrapData(payload) {
  if (payload?.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
    return payload.data;
  }
  return payload;
}

export function getApiErrorMessage(error, fallbackMessage) {
  if (error?.response?.status >= 500) {
    return 'Server error. Please try again in a few minutes.';
  }

  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallbackMessage
  );
}
