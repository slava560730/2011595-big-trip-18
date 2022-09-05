import { remove, render } from '../framework/render.js';
import TripListView from '../view/trip-list-view.js';
import TripSortView from '../view/trip-sort-view.js';
import PointsEmpty from '../view/points-empty.js';
import { SortType, TextFromFilter } from '../util/view-const.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../util/common.js';
import { sortByDay, sortByPrice, sortByTime } from '../util/point.js';

export default class TripEventsPresenter {
  #tripList = new TripListView();

  #tripEventsContainer = null;

  #pointsModel = [];
  #offersModel = null;
  #destinationsModel = null;
  #offersByTypeModel = null;

  #tripPoints = null;
  #sourcedTripPoints = [];
  #tripOffers = null;
  #tripDestinations = null;
  #tripOffersByType = null;

  #sortComponent = null;
  #pointPresenter = new Map();
  #currentSortType = SortType.DAY;

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

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.TIME:
        this.#tripPoints.sort(sortByTime);
        break;
      case SortType.PRICE:
        this.#tripPoints.sort(sortByPrice);
        break;
      default:
        this.#tripPoints.sort(sortByDay);
    }

    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#renderSort(sortType);
    this.#clearPointList();
    this.#renderPointList();
  };

  #renderSort = (sortType = SortType.DAY) => {
    remove(this.#sortComponent);
    this.#sortComponent = new TripSortView(sortType);

    render(this.#sortComponent, this.#tripEventsContainer);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderList = (tripEventsContainer) => {
    render(this.#tripList, tripEventsContainer);
  };

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #handleTaskChange = (updatedPoint) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedPoint);
    this.#sourcedTripPoints = updateItem(this.#sourcedTripPoints, updatedPoint);
    this.#pointPresenter
      .get(updatedPoint.id)
      .init(updatedPoint, this.#tripOffers, this.#tripDestinations, this.#tripOffersByType);
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
    const pointPresenter = new PointPresenter(
      this.#tripList.element,
      this.#handleTaskChange,
      this.#handleModeChange
    );
    pointPresenter.init(point, offers, destinations, offersByType);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderText = (text) => {
    const noPointsComponent = new PointsEmpty(text);

    render(noPointsComponent, this.#tripEventsContainer);
  };

  #renderPointList = () => {
    this.#renderList(this.#tripEventsContainer);

    this.#tripPoints.forEach((point) =>
      this.#renderPoint(point, this.#tripOffers, this.#tripDestinations, this.#tripOffersByType)
    );
  };

  init = () => {
    this.#tripPoints = [...this.#pointsModel.points];
    this.#sourcedTripPoints = [...this.#pointsModel.points];

    this.#renderSort();

    if (this.#tripPoints.length) {
      this.#renderPointList();
    } else {
      this.#renderText(TextFromFilter.EVERYTHING);
    }
  };
}
