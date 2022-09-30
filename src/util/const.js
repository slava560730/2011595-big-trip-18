import dayjs from 'dayjs';

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

export const Minutes = {
  MINUTES_IN_HOUR: 60,
  HOURS_IN_DAY: 24,
  MINUTES_IN_DAY: 1440,
};

export const SortType = {
  DAY: 'day',
  PRICE: 'price',
  TIME: 'time',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const BLANK_POINT = {
  basePrice: 0,
  type: 'taxi',
  dateFrom: dayjs(),
  dateTo: dayjs(),
  offers: [],
  destination: null,
};

export const ORIGIN_FIX = 1;
export const MAX_SHOW_NAMES_CITIES = 3;

export const BLANK_PICTURES = [
  {
    src: '',
    description: '',
  },
];
