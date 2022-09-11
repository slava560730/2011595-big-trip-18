import { getWordCapitalized, humanizeEditDate } from '../util/point.js';
import { DESTINATION_NAMES, OFFER_TYPES } from '../mock/const.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const BLANK_POINT = {
  basePrice: 0,
  type: '',
  dateFrom: null,
  dateTo: null,
  destination: '',
  offers: [],
};

const createEditPointTemplate = (points, offersData, destinationsData, offersByTypeData) => {
  const {
    basePrice = 0,
    type = '',
    dateFrom = null,
    dateTo = null,
    destination = '',
    offers = [],
  } = points;

  const name = destinationsData.find((el) => el.id === destination).name;
  const description = destinationsData.find((el) => el.id === destination).description;
  const pictures = destinationsData.find((el) => el.id === destination).pictures;

  const humanizedEditDateFrom = dateFrom !== null ? humanizeEditDate(dateFrom) : '';
  const humanizedEditDateTo = dateFrom !== null ? humanizeEditDate(dateTo) : '';

  const createPhotoTemplate = (src, pictureDescription) =>
    `<img class="event__photo" src="${src}" alt="${pictureDescription}">`;

  const createPhotosTemplate = (dataPictures) =>
    dataPictures.map((picture) => createPhotoTemplate(picture.src, picture.description)).join('');

  const isTypeChecked = (checkedType, currentType) =>
    currentType === checkedType ? 'checked' : '';

  const createTypeEditTemplate = (currentType, checkedType) => `
    <div class="event__type-item">
      <input id="event-type-${currentType}-${OFFER_TYPES.indexOf(currentType)}"
       class="event__type-input  visually-hidden" type="radio" name="event-type" value="${currentType}"
        ${isTypeChecked(checkedType, currentType)}>
      <label class="event__type-label  event__type-label--${currentType}"
       for="event-type-${currentType}-${OFFER_TYPES.indexOf(currentType)}">
        ${getWordCapitalized(currentType)}</label>
    </div>`;

  const createTypesEditTemplate = (checkedType) =>
    OFFER_TYPES.map((currentType) => createTypeEditTemplate(currentType, checkedType)).join('');

  const isOfferChecked = (offer) => (offers.includes(offer.id) ? 'checked' : '');

  const createOfferEditTemplate = (offer) => `
                      <div class="event__offer-selector">
                      <input class="event__offer-checkbox  visually-hidden"
                       id="event-offer-luggage-${offer.id}" type="checkbox"
                        name="event-offer-luggage"
                        ${isOfferChecked(offer)}>
                        <label class="event__offer-label" for="event-offer-luggage-${offer.id}">
                          <span class="event__offer-title">${offer.title}</span>
                          &plus;&euro;&nbsp;
                          <span class="event__offer-price">${offer.price}</span>
                        </label>
                      </div>
  `;

  const createOffersEditTemplate = () => {
    const offerEditByType = offersByTypeData.find((offer) => offer.type === type);

    return offerEditByType.offers.map((offer) => createOfferEditTemplate(offer)).join('');
  };

  const offersEditTemplate = createOffersEditTemplate();

  const createDataListDestination = (selectedCity) =>
    DESTINATION_NAMES.map(
      (city) => `
    <option value="${city}" ${selectedCity === city ? 'selected' : ''}></option>
       `
    ).join('');

  const createDestinationListTemplate = (selectedCity) => `
    <label class="event__label  event__type-output" for="event-destination-1">
    ${type}
    </label>
    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${selectedCity}" list="destination-list-1">
    <datalist id="destination-list-1">
    ${createDataListDestination(selectedCity)}
    </datalist>`;

  return `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>

                        ${createTypesEditTemplate(type)}

                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                        ${createDestinationListTemplate(name)}
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizedEditDateFrom}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizedEditDateTo}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                  <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    <div class="event__available-offers">

                    ${offersEditTemplate}

                    </div>
                  </section>

                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${description}</p>
                          <div class="event__photos-container">
        <div class="event__photos-tape">
          ${createPhotosTemplate(pictures)}
        </div>
      </div>
                  </section>
                </section>
              </form>
            </li>`;
};

export default class EditPointView extends AbstractStatefulView {
  #point = null;
  #offer = null;
  #destination = null;
  #offerByType = null;

  constructor(point = BLANK_POINT, offer, destination, offerByType) {
    super();
    this._state = EditPointView.parsePointToState(point);
    this.#point = point;
    this.#offer = offer;
    this.#destination = destination;
    this.#offerByType = offerByType;

    this.#setInnerHandlers();
  }

  get template() {
    return createEditPointTemplate(this._state, this.#offer, this.#destination, this.#offerByType);
  }

  reset = (point) => {
    this.updateElement(EditPointView.parsePointToState(point));
  };

  #setInnerHandlers = () => {
    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#eventDestinationInputHandler);

    this.element
      .querySelector('.event__input--price')
      .addEventListener('change', this.#eventPriceInputHandler);
  };

  #eventDestinationInputHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.value) {
      this.updateElement({
        destination: DESTINATION_NAMES.indexOf(evt.target.value),
      });
    }
  };

  #eventPriceInputHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      basePrice: evt.target.value,
    });
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setResetBtnClickHandler(this._callback.resetClick);
    this.setRollupBtnClickHandler(this._callback.click);
  };

  setRollupBtnClickHandler(callback) {
    this._callback.click = callback;

    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupBtnClickHandler);
  }

  #rollupBtnClickHandler = () => {
    this._callback.click();
  };

  setResetBtnClickHandler(callback) {
    this._callback.resetClick = callback;

    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#resetBtnClickHandler);
  }

  #resetBtnClickHandler = () => {
    this._callback.resetClick();
  };

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;

    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();

    this._callback.formSubmit(EditPointView.parseStateToPoint(this._state));
  };

  static parsePointToState = (point) => ({ ...point });

  static parseStateToPoint = (state) => {
    const point = { ...state };

    return point;
  };
}
