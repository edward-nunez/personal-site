export default function formatDate(dateInput) {
  if (!dateInput) return '';
  const parsedDate = new Date(dateInput);
  if (Number.isNaN(parsedDate.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(parsedDate);
}
