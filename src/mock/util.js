import { getRandomInteger } from '../util/common.js';
import { HoursInterval, MinSecInterval } from './const.js';
import dayjs from 'dayjs';

export const generateDate = (dayStart, dayEnd) => {
  const daysAdd = getRandomInteger(dayStart, dayEnd);
  const hoursAdd = getRandomInteger(HoursInterval.MIN, HoursInterval.MAX);
  const minutesAdd = getRandomInteger(MinSecInterval.MIN, MinSecInterval.MAX);
  const secondsAdd = getRandomInteger(MinSecInterval.MIN, MinSecInterval.MAX);

  return dayjs()
    .add(daysAdd, 'day')
    .add(hoursAdd, 'hour')
    .add(minutesAdd, 'minute')
    .add(secondsAdd, 'second')
    .toDate();
};
