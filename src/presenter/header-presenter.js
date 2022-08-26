import { render, RenderPosition } from '../render.js';
import HeaderInfoView from '../view/header-info-view.js';
import HeaderFiltersView from '../view/header-filters-view.js';

export default class HeaderPresenter {
  #infoContainer = null;
  #filterContainer = null;

  #headerInfoComponent = new HeaderInfoView();
  #headerFilterComponent = new HeaderFiltersView();

  #renderHeader = (infoContainer, filterContainer, place = RenderPosition.AFTERBEGIN) => {
    render(this.#headerInfoComponent, infoContainer, place);
    render(this.#headerFilterComponent, filterContainer);
  };

  init = (infoContainer, filterContainer) => {
    this.#infoContainer = infoContainer;
    this.#filterContainer = filterContainer;

    this.#renderHeader(infoContainer, filterContainer);
  };
}
