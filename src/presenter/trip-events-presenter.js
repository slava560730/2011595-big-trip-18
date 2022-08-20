import { render, RenderPosition } from '../render.js';
import TripListView from '../view/trip-list-view.js';
import TripSortView from '../view/trip-sort-view.js';
import EditEventView from '../view/edit-event-view.js';
import TripItemView from '../view/trip-item-view.js';

export default class TripEventsPresenter {
  tripList = new TripListView();

  init = (tripEventsContainer) => {
    this.tripEventsContainer = tripEventsContainer;

    render(new TripSortView(), this.tripEventsContainer);
    render(this.tripList, this.tripEventsContainer);
    render(new EditEventView(), this.tripList.getElement(), RenderPosition.AFTERBEGIN);

    for (let i = 0; i < 3; i++) {
      render(new TripItemView(), this.tripList.getElement());
    }
  };
}
