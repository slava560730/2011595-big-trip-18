import { getRandomArrayElement, getRandomInteger } from '../utils.js';
import { OFFER_TITLES, PriceRange } from './const.js';
import { getRandomId } from './point.js';

export const generateOffer = () => ({
  id: getRandomId(),
  title: getRandomArrayElement(OFFER_TITLES),
  price: getRandomInteger(PriceRange.MIN, PriceRange.MAX),
});
