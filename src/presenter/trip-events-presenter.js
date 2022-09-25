import { remove, render, RenderPosition } from '../framework/render.js';
import TripListView from '../view/trip-list-view.js';
import PointsEmpty from '../view/points-empty.js';
import {
  FilterType,
  SortType,
  UpdateType,
  UserAction,
} from '../util/view-const.js';
import PointPresenter from './point-presenter.js';
import { sortByDay, sortByPrice, sortByTime } from '../util/point.js';
import TripSortView from '../view/trip-sort-view.js';
import HeaderInfoView from '../view/header-info-view.js';

import { filter } from '../util/filter.js';
import NewPointPresenter from './new-point-presenter.js';
import { BLANK_POINT } from '../mock/const.js';

export default class TripEventsPresenter {
  #tripList = new TripListView();
  #sortComponent = null;
  #headerInfoComponent = null;
  #filterModel = null;
  #noPointsComponent = null;

  #tripEventsContainer = null;

  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #offersByTypeModel = null;

  #tripOffers = null;
  #tripDestinations = null;
  #tripOffersByType = null;

  #pointsPresenter = new Map();
  #pointNewPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  constructor(
    tripEventsContainer,
    pointsModel,
    offersModel,
    destinationsModel,
    offersByTypeModel,
    filterModel
  ) {
    this.#tripEventsContainer = tripEventsContainer;

    this.#pointsModel = pointsModel;
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel = filterModel;
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#pointNewPresenter = new NewPointPresenter(this.#tripList.element, this.#handleViewAction);

    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#offersByTypeModel = offersByTypeModel;

    this.#tripOffers = [...this.#offersModel.offers];
    this.#tripDestinations = [...this.#destinationsModel.destinations];
    this.#tripOffersByType = [...this.#offersByTypeModel.offersByType];
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredPoints.sort(sortByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
      default:
        return filteredPoints.sort(sortByDay);
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearContent();
    this.#renderContent();
  };

  #renderSort = () => {
    this.#sortComponent = new TripSortView(this.#currentSortType);
    this.#sortComponent.setCurrentSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#sortComponent, this.#tripEventsContainer); // element
  };

  #renderList = (tripEventsContainer) => {
    render(this.#tripList, tripEventsContainer);
  };

  #handleModeChange = () => {
    this.#pointNewPresenter.destroy();
    this.#pointsPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointsPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearContent();
        this.#renderContent();
        break;
      case UpdateType.MAJOR:
        this.#clearContent({ resetSortType: true });
        this.#renderContent();
        break;
    }
  };

  #renderTripInfo = () => {
    const tripMainElement = document.querySelector('.trip-main');
    this.#headerInfoComponent = new HeaderInfoView();
    render(this.#headerInfoComponent, tripMainElement, RenderPosition.AFTERBEGIN);
  };

  #renderText = () => {
    this.#noPointsComponent = new PointsEmpty(this.#filterType);
    render(this.#noPointsComponent, this.#tripEventsContainer);
  };

  #renderPoint = (
    point,
    offers = this.#tripOffers,
    destinations = this.#tripDestinations,
    offersByType = this.#tripOffersByType
  ) => {
    const pointPresenter = new PointPresenter(
      this.#tripList.element,
      this.#handleViewAction,
      this.#handleModeChange
    );
    pointPresenter.init(point, offers, destinations, offersByType);
    this.#pointsPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = (points) => {
    points.forEach((point) =>
      this.#renderPoint(point, this.#tripOffers, this.#tripDestinations, this.#tripOffersByType)
    );
  };

  #renderPointList = (points) => {
    this.#renderList(this.#tripEventsContainer);
    this.#renderPoints(points);
  };

  #clearContent = ({ resetSortType = false } = {}) => {
    this.#pointNewPresenter.destroy();
    this.#pointsPresenter.forEach((presenter) => presenter.destroy());
    this.#pointsPresenter.clear();

    remove(this.#headerInfoComponent);
    remove(this.#sortComponent);

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #renderContent = () => {
    const points = this.points;
    const pointCount = points.length;

    if (pointCount === 0) {
      this.#renderText();
      return;
    }

    this.#renderTripInfo();
    this.#renderSort();
    this.#renderPointList(points);
  };

  init = () => {
    this.#renderContent();
  };

  createPoint = (callback) => {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#pointNewPresenter.init(
      callback,
      BLANK_POINT,
      this.#tripOffers,
      this.#tripDestinations,
      this.#tripOffersByType
    );
  };
}
