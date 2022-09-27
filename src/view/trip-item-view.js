import { humanizeDate, humanizeTime, pointDuration } from '../util/point.js';
import AbstractView from '../framework/view/abstract-view.js';

const createTripItemTemplate = (points, offersData, destinationsData) => {
  const { basePrice, type, dateFrom, dateTo, destination, isFavorite, offers } = points;

  const createOfferTemplate = (offer) => `
    <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>
  `;

  const createOffersTemplate = () => {
    const offerByPointType = offersData.find((offer) => offer.type === type);

    return offers
      .map((offerId) => {
        const selectedOffer = offerByPointType.offers.find((el) => el.id === offerId);

        return createOfferTemplate(selectedOffer);
      })
      .join('');
  };

  const humanizedDateFrom = dateFrom !== null ? humanizeDate(dateFrom) : '';
  const humanizedTimeFrom = dateFrom !== null ? humanizeTime(dateFrom) : '';
  const humanizedTimeTo = dateTo !== null ? humanizeTime(dateTo) : '';

  const name = destinationsData.find((el) => el.id === destination).name;

  const favoriteClassName = isFavorite ? 'event__favorite-btn--active' : '';

  const offersTemplate = createOffersTemplate();

  return `<li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="${dateFrom}">${humanizedDateFrom}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${type} ${name}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${dateFrom}">${humanizedTimeFrom}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${dateTo}">${humanizedTimeTo}</time>
                  </p>
                  <p class="event__duration">${pointDuration(dateTo, dateFrom)}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
${offersTemplate}
                </ul>
                <button class="event__favorite-btn ${favoriteClassName}" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>`;
};

export default class TripItemView extends AbstractView {
  #point = null;
  #offer = null;
  #destination = null;

  constructor(point, offer, destination) {
    super();
    this.#point = point;
    this.#offer = offer;
    this.#destination = destination;
  }

  get template() {
    return createTripItemTemplate(this.#point, this.#offer, this.#destination);
  }

  setRollupBtnClickHandler(callback) {
    this._callback.click = callback;

    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupBtnClickHandler);
  }

  #rollupBtnClickHandler = () => {
    this._callback.click();
  };

  setFavoriteBtnClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element
      .querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteBtnClickHandler);
  };

  #favoriteBtnClickHandler = (evt) => {
    evt.preventDefault();

    this._callback.favoriteClick();
  };
}
