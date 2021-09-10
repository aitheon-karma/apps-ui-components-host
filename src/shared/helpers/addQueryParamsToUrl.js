export const addQueryParamsToUrl = (url, queryParams) => {
  const queryParamsString = Object.entries(queryParams).map(p => p.join('=')).join('&');
  return `${url}?${queryParamsString}`;
};
