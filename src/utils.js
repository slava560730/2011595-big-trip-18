import dayjs from 'dayjs';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomArrayElement = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);

  return array[randomIndex];
};

export const getWordCapitalized = (word) => word[0].toUpperCase() + word.slice(1);

export const humanizeDate = (date) => dayjs(date).format('MMM D');
export const humanizeTime = (date) => dayjs(date).format('hh:mm');
export const humanizeEditDate = (date) => dayjs(date).format('DD/MM/YY hh:mm');
