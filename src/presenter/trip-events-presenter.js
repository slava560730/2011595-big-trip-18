import { render, RenderPosition } from '../render.js';
import TripListView from '../view/trip-list-view.js';
import TripSortView from '../view/trip-sort-view.js';
import EditPointView from '../view/edit-point-view.js';
import TripItemView from '../view/trip-item-view.js';

export default class TripEventsPresenter {
  tripList = new TripListView();

  init = (tripEventsContainer, pointsModel, offersModel, destinationsModel, offersByTypeModel) => {
    this.tripEventsContainer = tripEventsContainer;

    this.pointsModel = pointsModel;
    this.tripPoints = [...this.pointsModel.getPoints()];

    this.offersModel = offersModel;
    this.tripOffers = [...this.offersModel.getOffers()];

    this.destinationsModel = destinationsModel;
    this.tripDestinations = [...this.destinationsModel.getDestinations()];

    this.offersByTypeModel = offersByTypeModel;
    this.tripOffersByType = [...this.offersByTypeModel.getOffersByType()];

    render(new TripSortView(), this.tripEventsContainer);
    render(this.tripList, this.tripEventsContainer);
    render(
      new EditPointView(
        this.tripPoints[0],
        this.tripOffers,
        this.tripDestinations,
        this.tripOffersByType
      ),
      this.tripList.getElement(),
      RenderPosition.AFTERBEGIN
    );

    this.tripPoints.forEach((point) => {
      render(
        new TripItemView(point, this.tripOffers, this.tripDestinations, this.tripOffersByType),
        this.tripList.getElement()
      );
    });
  };
}
