import {getRandomArrayElement, getRandomInteger} from '../util/common.js';
import { DESTINATION_DESCRIPTIONS, DESTINATION_NAMES } from './const.js';

export const generateDestTest = () => {
  const destinations = [];

  for (let i = 0; i < DESTINATION_NAMES.length; i++) {
    destinations.push({
      id: i,
      description: getRandomArrayElement(DESTINATION_DESCRIPTIONS),
      name: DESTINATION_NAMES[i],
      pictures: [
        {
          src: `https://via.placeholder.com/${getRandomInteger(1, 3)}50`,
          description: getRandomArrayElement(DESTINATION_DESCRIPTIONS),
        },
        {
          src: `https://via.placeholder.com/${getRandomInteger(1, 3)}50`,
          description: getRandomArrayElement(DESTINATION_DESCRIPTIONS),
        },
      ],
    });
  }
  return destinations;
};
