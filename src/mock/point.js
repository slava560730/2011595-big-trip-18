import { getRandomArrayElement, getRandomInteger } from '../utils.js';
import { BasePriceRange, IdRange } from './const.js';
import { generateDestination } from './destination.js';
import { generateOffer } from './offers-by-type.js';

export const generatePoint = () => ({
  basePrice: getRandomInteger(BasePriceRange.MIN, BasePriceRange.MAX),
  dateFrom: '2019-07-10T22:55:56.845Z',
  dateTo: '2019-07-11T11:22:13.375Z',
  destination: getRandomArrayElement(Array.from({ length: IdRange.MAX }, generateDestination)),
  id: getRandomInteger(IdRange.MIN, IdRange.MAX),
  isFavorite: Boolean(getRandomInteger(0, 1)),
  offers: getRandomArrayElement(Array.from({ length: IdRange.MAX }, generateOffer)).offers,
  type: getRandomArrayElement(Array.from({ length: IdRange.MAX }, generateOffer)).type,
});
