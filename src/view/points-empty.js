import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../util/view-const.js';

const EmptyListTextType = {
  [FilterType.EVERYTHING]: 'Click "NEW EVENT" in menu to create your first waypoint',
  [FilterType.FUTURE]: 'There are no future waypoints now',
  [FilterType.PAST]: 'There are no past waypoints now',
};

const createNoPointsTemplate = (filterType) => `<p class="trip-events__msg">${EmptyListTextType[filterType]}</p>`;

export default class PointsEmpty extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointsTemplate(this.#filterType);
  }
}
