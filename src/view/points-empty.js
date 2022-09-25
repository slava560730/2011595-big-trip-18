import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../util/view-const.js';

const EmptyListTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PAST]: 'There are no past events now',
};

const createNoPointsTemplate = (filterType) =>
  `<p class="trip-events__msg">${EmptyListTextType[filterType]}</p>`;

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
