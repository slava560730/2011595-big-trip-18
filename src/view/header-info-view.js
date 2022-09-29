import AbstractView from '../framework/view/abstract-view.js';

const createInfoTemplate = (points, offers, destinations) => {
  const pointsCount = points.length;

  return `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">Amsterdam &mdash; Chamonix &mdash; Geneva</h1>

              <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
            </div>

            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
            </p>
          </section>`;
};

export default class HeaderInfoView extends AbstractView {
  #points = null;
  #destinations = null;
  #offers = null;

  constructor(points, offers, destinations) {
    super();

    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    return createInfoTemplate(this.#points, this.#offers, this.#destinations);
  }
}
