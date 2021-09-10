export const capitalize = string => {
  if (!string) return '';
  string = string.toString();
  return string.split(' ')
    .map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join(' ');
};
