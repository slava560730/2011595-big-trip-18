import { getRandomArrayElement, getRandomInteger } from '../util/common.js';
import { OFFER_TITLES, PriceRange } from './const.js';

export const generateOffer = () => ({
  id: getRandomInteger(0, 2),
  title: getRandomArrayElement(OFFER_TITLES),
  price: getRandomInteger(PriceRange.MIN, PriceRange.MAX),
});
