import TripItemView from '../view/trip-item-view.js';
import EditPointView from '../view/edit-point-view.js';
import { remove, render, replace } from '../framework/render.js';
import { UpdateType, UserAction } from '../util/const.js';

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

  init = (point, tripOffers, tripDestinations) => {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new TripItemView(point, tripOffers, tripDestinations);

    this.#pointEditComponent = new EditPointView(point, tripOffers, tripDestinations);

    this.#pointComponent.setRollupBtnClickHandler(this.#handleOpenForm);
    this.#pointComponent.setFavoriteBtnClickHandler(this.#handleFavoriteClick);
    this.#pointEditComponent.setRollupBtnClickHandler(this.#handleCloseForm);
    this.#pointEditComponent.setResetBtnClickHandler(this.#handleResetForm);
    this.#pointEditComponent.setFormSubmitHandler(this.#handleSubmitForm);

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
      replace(this.#pointComponent, prevPointEditComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#resetEditToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  setSaving = () => {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  };

  setDeleting = () => {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  };

  setAborting = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
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

  #resetEditToPoint = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#replaceEditToPoint();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#resetEditToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #handleOpenForm = () => {
    this.#replacePointToEdit();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleCloseForm = () => {
    this.#resetEditToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleResetForm = (point) => {
    this.#changeData(UserAction.DELETE_POINT, UpdateType.MINOR, point);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleSubmitForm = (point) => {
    this.#changeData(UserAction.UPDATE_POINT, UpdateType.MAJOR, point);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFavoriteClick = () => {
    this.#changeData(UserAction.UPDATE_POINT, UpdateType.MINOR, {
      ...this.#point,
      isFavorite: !this.#point.isFavorite,
    });
  };
}
