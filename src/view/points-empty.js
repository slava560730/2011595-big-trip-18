import { createElement } from '../render.js';

const createNoPointsTemplate = (text) => `<p class="trip-events__msg">${text}</p>`;

export default class PointsEmpty {
  #text = null;
  #element = null;

  constructor(text) {
    this.#text = text;
  }

  get template() {
    return createNoPointsTemplate(this.#text);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
