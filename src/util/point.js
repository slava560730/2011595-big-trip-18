import dayjs from 'dayjs';
import { Minutes } from './const.js';

export const getWordCapitalized = (word) => word[0].toUpperCase() + word.slice(1);

export const humanizeDate = (date) => dayjs(date).format('MMM D');
export const humanizeTime = (date) => dayjs(date).format('hh:mm');
export const humanizeEditDate = (date) => dayjs(date).format('DD/MM/YY hh:mm');

export const isPointInFuture = ({ dateFrom }) =>
  dayjs().isSame(dayjs(dateFrom)) || dayjs().isBefore(dayjs(dateFrom));

export const isPointInPast = ({ dateTo }) => dayjs().isAfter(dayjs(dateTo));

export const pointDuration = (dateTo, dateFrom) => {
  const fullMinutes = dayjs(dateTo).diff(dateFrom, 'minute');
  const hours = Math.trunc(fullMinutes / Minutes.MINUTES_IN_HOUR);
  const minutes = fullMinutes % Minutes.MINUTES_IN_HOUR;
  const days = Math.trunc(hours / Minutes.HOURS_IN_DAY);
  const hoursDays = hours % Minutes.HOURS_IN_DAY;

  const viewHours = hours < 10 ? `0${hours}` : hours;
  const viewMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const viewDays = days < 10 ? `0${days}` : days;
  const viewHoursDays = hoursDays < 10 ? `0${hoursDays}` : hoursDays;

  if (fullMinutes < Minutes.MINUTES_IN_HOUR) {
    return `${viewMinutes}M`;
  }

  if (fullMinutes >= Minutes.MINUTES_IN_HOUR && fullMinutes < Minutes.MINUTES_IN_DAY) {
    return `${viewHours}H ${viewMinutes}M`;
  }

  if (fullMinutes >= Minutes.MINUTES_IN_DAY) {
    return `${viewDays}D ${viewHoursDays}H ${viewMinutes}M`;
  }
};

export const sortByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

export const sortByDay = (pointA, pointB) => {
  if (dayjs(pointB.dateFrom).isAfter(dayjs(pointA.dateFrom))) {
    return -1;
  } else {
    return 1;
  }
};

export const sortByTime = (pointA, pointB) => {
  const timeA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom), 'minute', true);
  const timeB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom), 'minute', true);

  return timeB - timeA;
};
