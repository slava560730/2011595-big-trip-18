import {remove, render, RenderPosition, replace} from '../framework/render.js';
import {sortByDay} from '../util/point.js';
import HeaderInfoView from '../view/header-info-view.js';

export default class InfoPresenter {
  #infoContainer = null;
  #pointsModel = null;

  #infoComponent = null;

  constructor(infoContainer, pointsModel) {
    this.#infoContainer = infoContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get sortedPoints() {
    return this.#pointsModel.points.sort(sortByDay);
  }

  init = () => {
    const points = this.sortedPoints;

    if (points.length === 0) {
      return;
    }

    const offers = this.#pointsModel.offers;
    const destinations = this.#pointsModel.destinations;

    const prevInfoComponent = this.#infoComponent;

    this.#infoComponent = new HeaderInfoView(points, offers, destinations);

    if (prevInfoComponent === null) {
      render(this.#infoComponent, this.#infoContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#infoComponent, prevInfoComponent);
    remove(prevInfoComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };
}
