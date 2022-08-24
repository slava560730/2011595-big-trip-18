import { getRandomArrayElement, getRandomInteger } from '../utils.js';
import { OFFER_TITLES, OFFER_TYPES, PriceRange } from './const.js';

export const generateOffersByType = () => ({
  type: getRandomArrayElement(OFFER_TYPES),
  offers: [
    {
      id: 1,
      title: getRandomArrayElement(OFFER_TITLES),
      price: getRandomInteger(PriceRange.MIN, PriceRange.MAX),
    },
    {
      id: 2,
      title: getRandomArrayElement(OFFER_TITLES),
      price: getRandomInteger(PriceRange.MIN, PriceRange.MAX),
    },
    {
      id: 3,
      title: getRandomArrayElement(OFFER_TITLES),
      price: getRandomInteger(PriceRange.MIN, PriceRange.MAX),
    },
  ],
});
