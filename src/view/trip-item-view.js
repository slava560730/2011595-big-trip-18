import {createElement} from '../render.js';
import {humanizeDate, humanizeTime} from '../utils.js';

const createOfferTemplate = (offer) => `
    <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>
  `;

const createTripItemTemplate = (points, offersData, destinationsData, offersByTypeData) => {
  const { basePrice, type, dateFrom, dateTo, destination, isFavorite, offers } = points;

  const createOffersTemplate = () => {
    const offerByPointType = offersByTypeData.find((offer) => offer.type === type);

    return offers
      .map((offerId) => {
        const selectedOffer = offerByPointType.offers.find((el) => (el.id === offerId));

        return createOfferTemplate(selectedOffer);
      })
      .join('');
  };

  const humanizedDateFrom = dateFrom !== null ? humanizeDate(dateFrom) : '';
  const humanizedTimeFrom = dateFrom !== null ? humanizeTime(dateFrom) : '';
  const humanizedTimeTo = dateTo !== null ? humanizeTime(dateTo) : '';

  const name = destinationsData.find((el) => (el.id === destination)).name;


  const favoriteClassName = isFavorite
    ? 'event__favorite-btn event__favorite-btn--active'
    : 'event__favorite-btn';

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
                  <p class="event__duration">${'продолжительность'}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
${offersTemplate}
                </ul>
                <button class="${favoriteClassName}" type="button">
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

export default class TripItemView {
  constructor(point, offer, destination, offerByType) {
    this.point = point;
    this.offer = offer;
    this.destination = destination;
    this.offerByType = offerByType;
  }

  getTemplate() {
    return createTripItemTemplate(this.point, this.offer, this.destination, this.offerByType);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
