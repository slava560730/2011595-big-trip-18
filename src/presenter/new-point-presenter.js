import { remove, render, RenderPosition } from '../framework/render.js';
import { UpdateType, UserAction } from '../util/const.js';
import { nanoid } from 'nanoid';
import AddPointView from '../view/add-point-view.js';

export default class NewPointPresenter {
  #changeData = null;
  #destroyCallback = null;
  #pointListContainer = null;
  #pointEditComponent = null;

  constructor(pointListContainer, changeData) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
  }

  init = (callback, point, tripOffers, tripDestinations) => {
    this.#destroyCallback = callback;

    if (this.#pointEditComponent !== null) {
      return;
    }
    this.#pointEditComponent = new AddPointView(
      point,
      tripOffers,
      tripDestinations
    );

    this.#pointEditComponent.setResetBtnClickHandler(this.#resetForm);
    this.#pointEditComponent.setFormSubmitHandler(this.#submitForm);

    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#destroyCallback?.();
    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  #resetForm = () => {
    this.destroy();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #submitForm = (point) => {
    this.#changeData(UserAction.ADD_POINT, UpdateType.MINOR, { id: nanoid(), ...point });
  };
}
