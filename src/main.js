import TripEventsPresenter from './presenter/trip-events-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsApiService from './model/points-api-service.js';
import InfoPresenter from './presenter/info-presenter.js';

const AUTHORIZATION = 'Basic hgjhg23gjhui1243yuhg3hgf3';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const siteHeaderElement = document.querySelector('.page-header');
const siteMainElement = document.querySelector('.page-main');
const tripFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');
const tripInfoElement = siteHeaderElement.querySelector('.trip-controls__filters');
const tripEventsElement = siteMainElement.querySelector('.trip-events');
const newEventBtn = document.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const tripEventsPresenter = new TripEventsPresenter(
  tripEventsElement,
  pointsModel,
  filterModel
);
const filterPresenter = new FilterPresenter(tripFiltersElement, filterModel, pointsModel);
const infoPresenter = new InfoPresenter(tripInfoElement, pointsModel);

const handleNewEventFormClose = () => {
  newEventBtn.disabled = false;
};

const handleNewEventButtonClick = () => {
  tripEventsPresenter.createPoint(handleNewEventFormClose);
  newEventBtn.disabled = true;
};

newEventBtn.addEventListener('click', handleNewEventButtonClick);

infoPresenter.init();

tripEventsPresenter.init();
filterPresenter.init();
newEventBtn.disabled = true;
pointsModel.init().finally(() => {
  handleNewEventFormClose();
  newEventBtn.addEventListener('click', handleNewEventButtonClick);
});
