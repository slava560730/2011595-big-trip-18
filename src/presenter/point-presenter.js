import TripItemView from '../view/trip-item-view.js';
import EditPointView from '../view/edit-point-view.js';
import { remove, render, replace } from '../framework/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #point = null;
  #mode = Mode.DEFAULT;
  #changeData = null;
  #changeMode = null;

  #pointListContainer = null;

  #pointComponent = null;
  #pointEditComponent = null;

  constructor(pointListContainer, changeData, changeMode) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point, tripOffers, tripDestinations, tripOffersByType) => {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new TripItemView(point, tripOffers, tripDestinations, tripOffersByType);

    this.#pointEditComponent = new EditPointView(
      point,
      tripOffers,
      tripDestinations,
      tripOffersByType
    );

    this.#pointComponent.setRollupBtnClickHandler(this.#openForm);
    this.#pointComponent.setFavoriteBtnClickHandler(this.#favoriteClick);
    this.#pointEditComponent.setRollupBtnClickHandler(this.#closeForm);
    this.#pointEditComponent.setResetBtnClickHandler(this.#closeForm);
    this.#pointEditComponent.setFormSubmitHandler(this.#submitForm);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    // Проверка на наличие в DOM необходима,
    // чтобы не пытаться заменить то, что не было отрисовано
    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceEditToPoint();
    }
  };

  // меняем точка на редактирование
  #replacePointToEdit = () => {
    replace(this.#pointEditComponent, this.#pointComponent);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  // меняем редактирование на точку
  #replaceEditToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    this.#mode = Mode.DEFAULT;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceEditToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #openForm = () => {
    this.#replacePointToEdit();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #closeForm = () => {
    this.#replaceEditToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #submitForm = (point) => {
    this.#changeData(point);
    this.#replaceEditToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #favoriteClick = () => {
    this.#changeData({ ...this.#point, isFavorite: !this.#point.isFavorite });
  };
}
