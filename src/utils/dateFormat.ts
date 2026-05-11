import moment from 'moment';

export const formatDateToMDY = (value: string): string => {
  if (!value || value === 'N/A') {
    return value;
  }

  const parsed = moment(value, ['YYYY-MM-DD', moment.ISO_8601, 'MM-DD-YYYY'], true);
  if (parsed.isValid()) {
    return parsed.format('MM-DD-YYYY');
  }

  const fallback = moment(value);
  return fallback.isValid() ? fallback.format('MM-DD-YYYY') : value;
};