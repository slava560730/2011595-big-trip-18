import dayjs from 'dayjs';

export const OFFER_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

export const BLANK_POINT = {
  basePrice: 0,
  type: 'taxi',
  dateFrom: dayjs(),
  dateTo: dayjs(),
  offers: [],
  destination: null,
};

export const BLANK_PICTURES = [
  {
    src: '',
    description: '',
  },
];
