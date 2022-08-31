import { render, RenderPosition } from '../framework/render.js';
import HeaderInfoView from '../view/header-info-view.js';

export default class HeaderPresenter {
  #infoContainer = null;
  #filterContainer = null;

  #headerInfoComponent = new HeaderInfoView();

  #renderHeader = (infoContainer, filterContainer, place = RenderPosition.AFTERBEGIN) => {
    render(this.#headerInfoComponent, infoContainer, place);
  };

  init = (infoContainer, filterContainer) => {
    this.#infoContainer = infoContainer;
    this.#filterContainer = filterContainer;

    this.#renderHeader(infoContainer, filterContainer);
  };
}
