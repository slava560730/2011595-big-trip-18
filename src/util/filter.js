import { FilterType } from './const.js';
import { isPointInFuture, isPointInPast } from './point.js';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points.filter((point) => point),
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointInFuture(point)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointInPast(point)),
};
