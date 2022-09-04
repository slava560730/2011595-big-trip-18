import {render, replace} from '../framework/render.js';
import TripListView from '../view/trip-list-view.js';
import TripSortView from '../view/trip-sort-view.js';
import EditPointView from '../view/edit-point-view.js';
import TripItemView from '../view/trip-item-view.js';
import PointsEmpty from '../view/points-empty.js';
import { TextFromFilter } from '../util/view-const.js';

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

  #sortComponent = new TripSortView();

  #renderSort = (tripEventsContainer) => {
    render(this.#sortComponent, tripEventsContainer);
  };

  #renderList = (tripEventsContainer) => {
    render(this.#tripList, tripEventsContainer);
  };

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

    // меняем точка на редактирование
    const replacePointToEdit = () => {
      replace(
        pointEditComponent,
        pointComponent
      );
    };

    // меняем редактирование на точку
    const replaceEditToPoint = () => {
      replace(
        pointComponent,
        pointEditComponent
      );
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceEditToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    const openForm = () => {
      replacePointToEdit();
      document.addEventListener('keydown', onEscKeyDown);
    };

    const closeForm = () => {
      replaceEditToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    };

    pointComponent.setRollupBtnClickHandler(openForm);

    pointEditComponent.setRollupBtnClickHandler(closeForm);

    pointEditComponent.setResetBtnClickHandler(closeForm);

    pointEditComponent.setFormSubmitHandler(closeForm);

    render(pointComponent, this.#tripList.element);
  };

  #renderText = (text) => {
    const noPointsComponent = new PointsEmpty(text);

    render(noPointsComponent, this.#tripEventsContainer);
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

    this.#renderSort(this.#tripEventsContainer);

    if (this.#tripPoints.length) {
      this.#renderList(this.#tripEventsContainer);

      this.#tripPoints.forEach(this.#renderPoint);
    } else {
      this.#renderText(TextFromFilter.EVERYTHING);
    }
  };
}
