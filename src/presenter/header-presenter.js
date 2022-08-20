import { render, RenderPosition } from '../render.js';
import HeaderInfoView from '../view/header-info-view.js';
import HeaderFiltersView from '../view/header-filters-view.js';

export default class HeaderPresenter {
  init = (infoContainer, filterContainer) => {
    this.infoContainer = infoContainer;
    this.filterContainer = filterContainer;

    render(new HeaderInfoView(), this.infoContainer, RenderPosition.AFTERBEGIN);
    render(new HeaderFiltersView(), this.filterContainer);
  };
}
