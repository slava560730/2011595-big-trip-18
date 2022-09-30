export const prefixToLowerDash = (prefix) => {
  const re = / /g;

  return prefix.replace(re, '-').toLowerCase();
};

export const getKeyByIdFromData = (pointsData, searchData, desiredKey) => searchData.find((el) => el.id === pointsData)[desiredKey];
