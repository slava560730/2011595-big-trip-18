import dayjs from 'dayjs';

export const getWordCapitalized = (word) => word[0].toUpperCase() + word.slice(1);

export const humanizeDate = (date) => dayjs(date).format('MMM D');
export const humanizeTime = (date) => dayjs(date).format('hh:mm');
export const humanizeEditDate = (date) => dayjs(date).format('DD/MM/YY hh:mm');
