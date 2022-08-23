import { render, RenderPosition } from '../render.js';
import TripListView from '../view/trip-list-view.js';
import TripSortView from '../view/trip-sort-view.js';
import EditPointView from '../view/edit-point-view.js';
import TripItemView from '../view/trip-item-view.js';

export default class TripEventsPresenter {
  tripList = new TripListView();

  init = (tripEventsContainer, pointsModel) => {
    this.tripEventsContainer = tripEventsContainer;
    this.pointsModel = pointsModel;
    this.tripPoints = [...this.pointsModel.getPoints()];

    render(new TripSortView(), this.tripEventsContainer);
    render(this.tripList, this.tripEventsContainer);
    render(
      new EditPointView(this.tripPoints[0]),
      this.tripList.getElement(),
      RenderPosition.AFTERBEGIN
    );

    for (let i = 0; i < this.tripPoints.length; i++) {
      render(new TripItemView(this.tripPoints[i]), this.tripList.getElement());
    }
  };
}
