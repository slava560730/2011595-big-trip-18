import TripItemView from '../view/trip-item-view.js';
import EditPointView from '../view/edit-point-view.js';
import { remove, render, replace } from '../framework/render.js';

export default class PointPresenter {
  #point = null;
  #changeData = null;

  #pointListContainer = null;

  #pointComponent = null;
  #pointEditComponent = null;

  constructor(pointListContainer, changeData) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
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
    this.#pointEditComponent.setRollupBtnClickHandler(this.#closeForm);
    this.#pointEditComponent.setResetBtnClickHandler(this.#closeForm);
    this.#pointEditComponent.setFormSubmitHandler(this.#submitForm);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    // Проверка на наличие в DOM необходима,
    // чтобы не пытаться заменить то, что не было отрисовано
    if (this.#pointListContainer.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#pointListContainer.contains(prevPointEditComponent.element)) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  };

  // меняем точка на редактирование
  #replacePointToEdit = () => {
    replace(this.#pointEditComponent, this.#pointComponent);
  };

  // меняем редактирование на точку
  #replaceEditToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
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
}
