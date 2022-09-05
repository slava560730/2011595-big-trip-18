import { render } from '../framework/render.js';
import TripListView from '../view/trip-list-view.js';
import TripSortView from '../view/trip-sort-view.js';
import PointsEmpty from '../view/points-empty.js';
import { TextFromFilter } from '../util/view-const.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../util/common.js';

export default class TripEventsPresenter {
  #tripList = new TripListView();

  #tripEventsContainer = null;

  #pointsModel = [];
  #offersModel = null;
  #destinationsModel = null;
  #offersByTypeModel = null;

  #tripPoints = null;
  #tripOffers = null;
  #tripDestinations = null;
  #tripOffersByType = null;

  #sortComponent = new TripSortView();
  #pointPresenter = new Map();

  #renderSort = (tripEventsContainer) => {
    render(this.#sortComponent, tripEventsContainer);
  };

  #renderList = (tripEventsContainer) => {
    render(this.#tripList, tripEventsContainer);
  };

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #handleTaskChange = (
    updatedPoint,
    offers = this.#tripOffers,
    destinations = this.#tripDestinations,
    offersByType = this.#tripOffersByType
  ) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedPoint);
    this.#pointPresenter
      .get(updatedPoint.id)
      .init(updatedPoint, offers, destinations, offersByType);
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderPoint = (
    point,
    offers = this.#tripOffers,
    destinations = this.#tripDestinations,
    offersByType = this.#tripOffersByType
  ) => {
    const pointPresenter = new PointPresenter(this.#tripList.element, this.#handleTaskChange, this.#handleModeChange);
    pointPresenter.init(point, offers, destinations, offersByType);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderText = (text) => {
    const noPointsComponent = new PointsEmpty(text);

    render(noPointsComponent, this.#tripEventsContainer);
  };

  constructor(tripEventsContainer, pointsModel, offersModel, destinationsModel, offersByTypeModel) {
    this.#tripEventsContainer = tripEventsContainer;

    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#offersByTypeModel = offersByTypeModel;

    this.#tripOffers = [...this.#offersModel.offers];
    this.#tripDestinations = [...this.#destinationsModel.destinations];
    this.#tripOffersByType = [...this.#offersByTypeModel.offersByType];
  }

  init = () => {
    this.#tripPoints = [...this.#pointsModel.points];

    this.#renderSort(this.#tripEventsContainer);

    if (this.#tripPoints.length) {
      this.#renderList(this.#tripEventsContainer);

      this.#tripPoints.forEach((point) =>
        this.#renderPoint(point, this.#tripOffers, this.#tripDestinations, this.#tripOffersByType)
      );
    } else {
      this.#renderText(TextFromFilter.EVERYTHING);
    }
  };
}
