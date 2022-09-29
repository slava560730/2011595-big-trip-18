import { remove, render, RenderPosition } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import TripListView from '../view/trip-list-view.js';
import PointsEmpty from '../view/points-empty.js';
import {
  BLANK_POINT,
  FilterType,
  SortType,
  UpdateType,
  UserAction,
} from '../util/const.js';
import PointPresenter from './point-presenter.js';
import { sortByDay, sortByPrice, sortByTime } from '../util/point.js';
import TripSortView from '../view/trip-sort-view.js';
// import HeaderInfoView from '../view/header-info-view.js';

import { filter } from '../util/filter.js';
import NewPointPresenter from './new-point-presenter.js';
import LoadingView from '../view/loading-view.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class TripEventsPresenter {
  #tripList = new TripListView();
  #loadingComponent = new LoadingView();
  #sortComponent = null;
  #headerInfoComponent = null;
  #filterModel = null;
  #noPointsComponent = null;

  #tripEventsContainer = null;

  #pointsModel = null;

  #tripOffers = null;
  #tripDestinations = null;

  #pointsPresenter = new Map();
  #pointNewPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(
    tripEventsContainer,
    pointsModel,
    filterModel
  ) {
    this.#tripEventsContainer = tripEventsContainer;

    this.#pointsModel = pointsModel;
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel = filterModel;
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#pointNewPresenter = new NewPointPresenter(this.#tripList.element, this.#handleViewAction);
  }

  get points() {
    this.#tripDestinations = this.#pointsModel.destinations;
    this.#tripOffers = this.#pointsModel.offers;
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

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsPresenter.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointsPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#pointNewPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#pointNewPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointsPresenter.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointsPresenter.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderContent();
        break;
    }
  };

  // #renderTripInfo = () => {
  //   const tripMainElement = document.querySelector('.trip-main');
  //   this.#headerInfoComponent = new HeaderInfoView();
  //   render(this.#headerInfoComponent, tripMainElement, RenderPosition.AFTERBEGIN);
  // };

  #renderText = () => {
    this.#noPointsComponent = new PointsEmpty(this.#filterType);
    render(this.#noPointsComponent, this.#tripEventsContainer);
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
  };

  #renderPoint = (
    point,
    offers = this.#tripOffers,
    destinations = this.#tripDestinations
  ) => {
    const pointPresenter = new PointPresenter(
      this.#tripList.element,
      this.#handleViewAction,
      this.#handleModeChange
    );
    pointPresenter.init(point, offers, destinations);
    this.#pointsPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = (points) => {
    points.forEach((point) =>
      this.#renderPoint(point, this.#tripOffers, this.#tripDestinations)
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
    remove(this.#loadingComponent);
    remove(this.#sortComponent);

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #renderContent = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const points = this.points;
    const pointCount = points.length;

    if (pointCount === 0) {
      this.#renderText();
      return;
    }

    // this.#renderTripInfo();
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
      this.#tripDestinations
    );
  };
}
