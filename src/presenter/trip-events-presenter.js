import { render } from '../render.js';
import TripListView from '../view/trip-list-view.js';
import TripSortView from '../view/trip-sort-view.js';
import EditPointView from '../view/edit-point-view.js';
import TripItemView from '../view/trip-item-view.js';

export default class TripEventsPresenter {
  #tripList = new TripListView();

  #tripEventsContainer = null;

  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #offersByTypeModel = null;

  #tripPoints = null;
  #tripOffers = null;
  #tripDestinations = null;
  #tripOffersByType = null;

  #renderPoint = (point) => {
    const pointComponent = new TripItemView(
      point,
      this.#tripOffers,
      this.#tripDestinations,
      this.#tripOffersByType
    );
    const pointEditComponent = new EditPointView(
      point,
      this.#tripOffers,
      this.#tripDestinations,
      this.#tripOffersByType
    );

    // кнопка стрелка вниз
    const pointEditButton = pointComponent.element.querySelector('.event__rollup-btn');
    // кнопка delete
    const deleteEditPointButton = pointEditComponent.element.querySelector('.event__reset-btn');
    // кнопка стрелка вверх
    const closeEditPointButton = pointEditComponent.element.querySelector('.event__rollup-btn');

    // меняем точка на редактирование
    const replacePointToEdit = () => {
      pointComponent.element.parentNode.replaceChild(
        pointEditComponent.element,
        pointComponent.element
      );
    };

    // меняем редактирование на точку
    // pointEditComponent.element.parentNode.replaceChild(
    const replaceEditToPoint = () => {
      this.#tripList.element.replaceChild(
        pointComponent.element,
        pointEditComponent.element
      );
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceEditToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    // Листенер для кнопки-стрелки при закрытой форме редактирования + добавляем Esc
    pointEditButton.addEventListener('click', () => {
      replacePointToEdit();
      document.addEventListener('keydown', onEscKeyDown);
    });

    // Листенер для кнопки-стрелки на форме редактирования
    closeEditPointButton.addEventListener('click', () => {
      replaceEditToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    // Листенер для кнопки delete на форме редактирования
    deleteEditPointButton.addEventListener('click', () => {
      replaceEditToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    // Листенер для формы редактирования
    pointEditComponent.element.addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceEditToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(pointComponent, this.#tripList.element);
  };

  init = (tripEventsContainer, pointsModel, offersModel, destinationsModel, offersByTypeModel) => {
    this.#tripEventsContainer = tripEventsContainer;

    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#offersByTypeModel = offersByTypeModel;

    this.#tripPoints = [...this.#pointsModel.points];
    this.#tripOffers = [...this.#offersModel.offers];
    this.#tripDestinations = [...this.#destinationsModel.destinations];
    this.#tripOffersByType = [...this.#offersByTypeModel.offersByType];

    render(new TripSortView(), this.#tripEventsContainer);
    render(this.#tripList, this.#tripEventsContainer);

    this.#tripPoints.forEach((point) => {
      this.#renderPoint(point);
    });
  };
}
