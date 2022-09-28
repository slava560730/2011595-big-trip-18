import { getWordCapitalized, humanizeEditDate } from '../util/point.js';
import { BLANK_PICTURES } from '../mock/const.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import he from 'he';

import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css';
import { ORIGIN_FIX } from '../util/const.js';
import { prefixToLowerDash } from '../util/common.js';

const createAddPointTemplate = (points, offersData, destinationsData, cities, types) => {
  const { basePrice, type, dateFrom, dateTo, offers, destination, isDisabled, isSaving } = points;

  const name =
    destination !== null ? destinationsData.find((el) => el.id === destination).name : '';
  const description =
    destination !== null ? destinationsData.find((el) => el.id === destination).description : '';
  const pictures =
    destination !== null
      ? destinationsData.find((el) => el.id === destination).pictures
      : BLANK_PICTURES;

  const humanizedAddDateFrom = humanizeEditDate(dateFrom);
  const humanizedAddDateTo = humanizeEditDate(dateTo);

  const createPhotoTemplate = (src, pictureDescription) =>
    pictures !== BLANK_PICTURES
      ? `<img class="event__photo" src="${src}" alt="${pictureDescription}">`
      : '';

  const createPhotosTemplate = (dataPictures) =>
    dataPictures.map((picture) => createPhotoTemplate(picture.src, picture.description)).join('');

  const isTypeChecked = (checkedType, currentType) =>
    currentType === checkedType ? 'checked' : '';

  const createTypeAddTemplate = (currentType, checkedType) => `
    <div class="event__type-item">
      <input id="event-type-${currentType}-${types.indexOf(currentType)}"
       class="event__type-input  visually-hidden" type="radio" name="event-type" value="${currentType}"
        ${isTypeChecked(checkedType, currentType)}>
      <label class="event__type-label  event__type-label--${currentType}"
       for="event-type-${currentType}-${types.indexOf(currentType)}">
        ${getWordCapitalized(currentType)}</label>
    </div>`;

  const createTypesAddTemplate = (checkedType) =>
    types.map((currentType) => createTypeAddTemplate(currentType, checkedType)).join('');

  const isOfferChecked = (offer) => (offers.includes(offer.id) ? 'checked' : '');

  const createOfferAddTemplate = (offer) => {
    const dashPrefix = prefixToLowerDash(offer.title);

    return ` <div class="event__offer-selector">
                      <input class="event__offer-checkbox  visually-hidden"
                       id="event-offer-${dashPrefix}-${offer.id}" type="checkbox"
                        name="event-offer-${dashPrefix}"
                        ${isOfferChecked(offer)} data-id="${offer.id}"
                        ${isDisabled ? 'disabled' : ''}>
                        <label class="event__offer-label"
                         for="event-offer-${dashPrefix}-${offer.id}">
                          <span class="event__offer-title">${offer.title}</span>
                          &plus;&euro;&nbsp;
                          <span class="event__offer-price">${offer.price}</span>
                        </label>
                      </div>`;
  };

  const createOffersAddTemplate = () => {
    const offerAddByType = offersData.find((offer) => offer.type === type);

    return offerAddByType.offers.map((offer) => createOfferAddTemplate(offer)).join('');
  };

  const offersAddTemplate = createOffersAddTemplate();

  const createDataListDestination = (selectedCity) =>
    cities
      .map(
        (city) => `
    <option value="${city}" ${selectedCity === city ? 'selected' : ''}></option>
       `
      )
      .join('');

  const createDestinationListTemplate = (selectedCity) => `
    <label class="event__label  event__type-output" for="event-destination-1">
    ${type}
    </label>
    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination"
    value="${he.encode(selectedCity)}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
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
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1"
                     type="checkbox" ${isDisabled ? 'disabled' : ''}>

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                        ${createTypesAddTemplate(type)}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                        ${createDestinationListTemplate(name)}
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
                     value="${humanizedAddDateFrom}" ${isDisabled ? 'disabled' : ''}>
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
                     value="${humanizedAddDateTo}" ${isDisabled ? 'disabled' : ''}>
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price"
                     value="${basePrice}" ${isDisabled ? 'disabled' : ''} min="1">
                  </div>

                  <button class="event__save-btn  btn  btn--blue"
                   type="submit">${isSaving ? 'Saving...' : 'Save'}</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>

                <section class="event__details">
                  <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                    <div class="event__available-offers">
                    ${offersAddTemplate}
                    </div>
                  </section>

                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${description}</p>
${
  pictures === BLANK_PICTURES
    ? createPhotosTemplate(pictures)
    : `<div class="event__photos-container">
                        <div class="event__photos-tape">
                            ${createPhotosTemplate(pictures)}
                        </div>`
}
                    </div>
                  </section>
                </section>
              </form>
            </li>`;
};

export default class AddPointView extends AbstractStatefulView {
  #offers = null;
  #destinations = null;
  #cities = null;
  #types = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #checkboxesOfOffers = null;

  constructor(point, offers, destinations) {
    super();

    this._state = AddPointView.parsePointToState(point);

    this.#offers = offers;
    this.#destinations = destinations;
    this.#cities = this.#destinations.map((dest) => dest.name);
    this.#types = this.#offers.map((offer) => offer.type);

    this.#setInnerHandlers();
    this.#setToDatepicker();
    this.#setFromDatepicker();
  }

  get template() {
    return createAddPointTemplate(
      this._state,
      this.#offers,
      this.#destinations,
      this.#cities,
      this.#types
    );
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
    this.updateElement(AddPointView.parsePointToState(point));
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
      ['time_24hr']: true,
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
      ['time_24hr']: true,
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
        destination: Number(this.#cities.indexOf(evt.target.value) + ORIGIN_FIX),
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
    this.#setToDatepicker();
    this.#setFromDatepicker();
  };

  setResetBtnClickHandler(callback) {
    this._callback.resetClick = callback;

    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#resetBtnClickHandler);
  }

  #resetBtnClickHandler = () => {
    this._callback.resetClick(AddPointView.parseStateToPoint(this._state));
  };

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;

    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();

    if (this._state.destination === null) {
      this.shake();
      return;
    }

    this._callback.formSubmit(AddPointView.parseStateToPoint(this._state));
  };

  static parseStateToPoint = (state) => {
    const point = { ...state };

    delete point.isDisabled;
    delete point.isSaving;

    return point;
  };

  static parsePointToState = (point) => ({
    ...point,
    isDisabled: false,
    isSaving: false,
  });
}
