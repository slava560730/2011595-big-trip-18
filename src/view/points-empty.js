import AbstractView from '../framework/view/abstract-view.js';

const createNoPointsTemplate = (text) => `<p class="trip-events__msg">${text}</p>`;

export default class PointsEmpty extends AbstractView {
  #text = null;

  constructor(text) {
    super();
    this.#text = text;
  }

  get template() {
    return createNoPointsTemplate(this.#text);
  }
}
