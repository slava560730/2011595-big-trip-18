import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';
import { getKeyByIdFromData } from '../util/common.js';
import {MAX_SHOW_NAMES_CITIES} from '../util/const.js';

const getTotalCost = (points, offers) => {
  const coastOffersPoint = points.map((point) => {
    const offersByType = offers.find((offer) => offer.type === point.type).offers;
    return point.offers
      .map((offerId) => offersByType.find((offer) => offer.id === offerId).price)
      .reduce((firstPrice, secondPrice) => firstPrice + secondPrice, 0);
  });

  const totalOffersCost = coastOffersPoint.reduce((firstPrice, secondPrice) => firstPrice + secondPrice, 0);
  const totalBasePriceCost = points.map((point) => point.basePrice).reduce((firstPrice, secondPrice) => firstPrice + secondPrice, 0);

  return totalOffersCost + totalBasePriceCost;
};

const getDestinationWay = (pointsData, destinationsData) => {
  const destinationsId = pointsData.map((point) => point.destination);
  const destinationsNoNextRepeatId = destinationsId.filter(
    (item, index) => item !== destinationsId[index - 1]
  );

  if (destinationsNoNextRepeatId.length > MAX_SHOW_NAMES_CITIES) {
    return `${getKeyByIdFromData(
      pointsData[0].destination,
      destinationsData,
      'name'
    )} – ... – ${getKeyByIdFromData(pointsData[pointsData.length - 1].destination, destinationsData, 'name')}`;
  } else {
    return destinationsNoNextRepeatId
      .map((destination) => getKeyByIdFromData(destination, destinationsData, 'name'))
      .join(' – ');
  }
};

const createInfoTemplate = (points, offers, destinations) => {
  const pointsCount = points.length;
  const totalCost = getTotalCost(points, offers);
  const dateStart = dayjs(points[0].dateFrom).format('DD MMM');
  const dateFinish = dayjs(points[pointsCount - 1].dateTo).format('DD MMM');

  const totalWay = getDestinationWay(points, destinations);

  return (`<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${totalWay}</h1>

              <p class="trip-info__dates">${dateStart}&nbsp;&mdash;&nbsp;${dateFinish}</p>
            </div>

            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
            </p>
          </section>`);
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
