export const prefixToLowerDash = (prefix) => {
  const re = / /g;

  return prefix.replace(re, '-').toLowerCase();
};
