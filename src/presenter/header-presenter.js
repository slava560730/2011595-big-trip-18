import { render, RenderPosition } from '../framework/render.js';
import HeaderInfoView from '../view/header-info-view.js';

export default class HeaderPresenter {
  #infoContainer = null;

  #headerInfoComponent = new HeaderInfoView();

  #renderHeader = (infoContainer, place = RenderPosition.AFTERBEGIN) => {
    render(this.#headerInfoComponent, infoContainer, place);
  };

  init = (infoContainer) => {
    this.#infoContainer = infoContainer;

    this.#renderHeader(infoContainer);
  };
}
