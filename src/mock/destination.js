import { getRandomArrayElement, getRandomInteger } from '../utils.js';
import {DESTINATION_DESCRIPTIONS, DESTINATION_NAMES, PicRange} from './const.js';

export const generateDestination = () => ({
  id: 1,
  description: getRandomArrayElement(DESTINATION_DESCRIPTIONS),
  name: getRandomArrayElement(DESTINATION_NAMES),
  pictures: [
    {
      src: `http://picsum.photos/248/152?r=${getRandomInteger(PicRange.MIN, PicRange.MAX)}`,
      description: getRandomArrayElement(DESTINATION_DESCRIPTIONS),
    },
    {
      src: `http://picsum.photos/248/152?r=${getRandomInteger(PicRange.MIN, PicRange.MAX)}`,
      description: getRandomArrayElement(DESTINATION_DESCRIPTIONS),
    },
  ],
});
