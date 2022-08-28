import { getRandomArrayElement, getRandomInteger } from '../util/utils.js';
import { BasePriceRange, IdRange } from './const.js';
import { generateOffersByType } from './offers-by-type.js';

export const getRandomId = () => getRandomInteger(1, 3);

export const generatePoint = () => ({
  basePrice: getRandomInteger(BasePriceRange.MIN, BasePriceRange.MAX),
  dateFrom: '2019-07-10T22:55:56.845Z',
  dateTo: '2019-07-11T11:22:13.375Z',
  destination: getRandomId(),
  id: getRandomInteger(IdRange.MIN, IdRange.MAX),
  isFavorite: Boolean(getRandomInteger(0, 1)),
  offers: Array.from({ length: getRandomInteger(1, 3) }, getRandomId),
  type: getRandomArrayElement(Array.from({ length: IdRange.MAX }, generateOffersByType)).type,
});
