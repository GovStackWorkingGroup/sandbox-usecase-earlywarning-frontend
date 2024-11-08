export const formatDate = (dateString: string, includeYear = true) => {
  const options: Intl.DateTimeFormatOptions = includeYear
    ? { month: '2-digit', day: '2-digit', year: 'numeric' }
    : { month: '2-digit', day: '2-digit' };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};

export const formatPeriod = (start: string, end: string, includeStartYear = true) => {
  const startDate = formatDate(start, includeStartYear);
  const endDate = formatDate(end, true);
  return `${startDate} • ${endDate}`;
};
