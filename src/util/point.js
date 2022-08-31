import dayjs from 'dayjs';
import {getRandomInteger} from './common.js';
import {HoursInterval, MinSecInterval} from '../mock/const.js';

export const getWordCapitalized = (word) => word[0].toUpperCase() + word.slice(1);

export const humanizeDate = (date) => dayjs(date).format('MMM D');
export const humanizeTime = (date) => dayjs(date).format('hh:mm');
export const humanizeEditDate = (date) => dayjs(date).format('DD/MM/YY hh:mm');

export const isPointInFuture = ({dateFrom, dateTo}) => dayjs().isSame(dayjs(dateFrom)) || dayjs().isBefore(dayjs(dateFrom)) || dayjs().isAfter(dayjs(dateFrom)) && dayjs().isBefore(dayjs(dateTo));

export const isPointInPast = ({dateTo}) => dayjs().isAfter(dayjs(dateTo));

export const generateDate = (dayStart, dayEnd) => {
  const daysAdd = getRandomInteger(dayStart, dayEnd);
  const hoursAdd = getRandomInteger(HoursInterval.MIN, HoursInterval.MAX);
  const minutesAdd = getRandomInteger(MinSecInterval.MIN, MinSecInterval.MAX);
  const secondsAdd = getRandomInteger(MinSecInterval.MIN, MinSecInterval.MAX);

  return dayjs().add(daysAdd, 'day').add(hoursAdd, 'hour').add(minutesAdd, 'minute').add(secondsAdd, 'second').toDate();
};
