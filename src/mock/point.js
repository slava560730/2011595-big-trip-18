import { getRandomArrayElement, getRandomInteger } from '../util/common.js';
import { BasePriceRange, IdRange } from './const.js';
import { generateOffersByType } from './offers-by-type.js';
import {generateDate} from '../util/point.js';

export const getRandomId = () => getRandomInteger(1, 3);

export const generatePoint = () => ({
  basePrice: getRandomInteger(BasePriceRange.MIN, BasePriceRange.MAX),
  dateFrom: generateDate(-2, -1),
  dateTo: generateDate(-1, 2),
  destination: getRandomId(),
  id: getRandomInteger(IdRange.MIN, IdRange.MAX),
  isFavorite: Boolean(getRandomInteger(0, 1)),
  offers: Array.from({ length: getRandomInteger(1, 3) }, getRandomId),
  type: getRandomArrayElement(Array.from({ length: IdRange.MAX }, generateOffersByType)).type,
});
