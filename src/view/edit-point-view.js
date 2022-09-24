import { getWordCapitalized, humanizeEditDate } from '../util/point.js';
import { DESTINATION_NAMES, OFFER_TYPES } from '../mock/const.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import he from 'he';

import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css';
import { prefixToLowerDash } from '../mock/util.js';

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

  const createOfferEditTemplate = (offer) => {
    const dashPrefix = prefixToLowerDash(offer.title);

    return ` <div class="event__offer-selector">
                      <input class="event__offer-checkbox  visually-hidden"
                       id="event-offer-${dashPrefix}-${offer.id}" type="checkbox"
                        name="event-offer-${dashPrefix}"
                        ${isOfferChecked(offer)} data-id="${offer.id}">
                        <label class="event__offer-label"
                         for="event-offer-${dashPrefix}-${offer.id}">
                          <span class="event__offer-title">${offer.title}</span>
                          &plus;&euro;&nbsp;
                          <span class="event__offer-price">${offer.price}</span>
                        </label>
                      </div>`;
  };

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
    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(selectedCity)}" list="destination-list-1">
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
                    <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}">
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
  #offer = null;
  #destination = null;
  #offerByType = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #checkboxesOfOffers = null;

  constructor(point = BLANK_POINT, offer, destination, offerByType) {
    super();

    if (!point) {
      point = BLANK_POINT;
    }

    this._state = EditPointView.parsePointToState(point);

    this.#offer = offer;
    this.#destination = destination;
    this.#offerByType = offerByType;

    this.#setInnerHandlers();
    this.#setToDatepicker();
    this.#setFromDatepicker();
  }

  get template() {
    return createEditPointTemplate(this._state, this.#offer, this.#destination, this.#offerByType);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.destroyDatepickerFrom();
    }

    if (this.#datepickerTo) {
      this.destroyDatepickerTo();
    }
  };

  reset = (point) => {
    this.updateElement(EditPointView.parsePointToState(point));
  };

  #setInnerHandlers = () => {
    this.#checkboxesOfOffers = this.element.querySelectorAll('.event__offer-checkbox');

    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

    this.element
      .querySelector('.event__input--price')
      .addEventListener('change', this.#priceChangeHandler);

    this.element
      .querySelectorAll('.event__type-input')
      .forEach((eventType) => eventType.addEventListener('click', this.#typeToggleHandler));

    this.#checkboxesOfOffers.forEach((eventOffer) =>
      eventOffer.addEventListener('change', this.#selectOffersToggleHandler)
    );
  };

  destroyDatepickerFrom = () => {
    this.#datepickerFrom.destroy();
    this.#datepickerFrom = null;
  };

  destroyDatepickerTo = () => {
    this.#datepickerTo.destroy();
    this.#datepickerTo = null;
  };

  #dateStartHandler = ([userDateStart]) => {
    this.updateElement({
      dateFrom: userDateStart,
    });

    this.destroyDatepickerFrom();
  };

  #dateEndHandler = ([userDateEnd]) => {
    this.updateElement({
      dateTo: userDateEnd,
    });

    this.destroyDatepickerTo();
  };

  #setToDatepicker = () => {
    const dateStartInput = this.element.querySelector('input[name="event-start-time"]');
    const dateEndInput = this.element.querySelector('input[name="event-end-time"]');
    this.#datepickerTo = flatpickr(dateEndInput, {
      enableTime: true,
      // eslint-disable-next-line camelcase
      time_24hr: true,
      defaultDate: dateEndInput.value,
      dateFormat: 'd/m/y H:i',
      minDate: dateStartInput.value,
      onClose: this.#dateEndHandler,
    });
  };

  #setFromDatepicker = () => {
    const dateStartInput = this.element.querySelector('input[name="event-start-time"]');
    const dateEndInput = this.element.querySelector('input[name="event-end-time"]');
    this.#datepickerFrom = flatpickr(dateStartInput, {
      enableTime: true,
      // eslint-disable-next-line camelcase
      time_24hr: true,
      defaultDate: dateStartInput.value,
      dateFormat: 'd/m/y H:i',
      maxDate: dateEndInput.value,
      onClose: this.#dateStartHandler,
    });
  };

  #selectOffersToggleHandler = () => {
    const selectedOffers = [];

    this.#checkboxesOfOffers.forEach((checkbox) =>
      checkbox.checked ? selectedOffers.push(Number(checkbox.dataset.id)) : ''
    );

    this.updateElement({
      offers: selectedOffers,
    });
  };

  #typeToggleHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.value) {
      this.updateElement({
        type: evt.target.value,
        offers: [],
      });
    }
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.value) {
      this.updateElement({
        destination: DESTINATION_NAMES.indexOf(evt.target.value),
      });
    }
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.value) {
      this.updateElement({
        basePrice: evt.target.value,
      });
    }
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setResetBtnClickHandler(this._callback.resetClick);
    this.setRollupBtnClickHandler(this._callback.click);
    this.#setToDatepicker();
    this.#setFromDatepicker();
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
    this._callback.resetClick(EditPointView.parseStateToPoint(this._state));
  };

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;

    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();

    this._callback.formSubmit(EditPointView.parseStateToPoint(this._state));
  };

  static parseStateToPoint = (state) => {
    const point = { ...state };

    return point;
  };

  static parsePointToState = (point) => ({ ...point });
}
