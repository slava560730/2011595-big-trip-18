import TripEventsPresenter from './presenter/trip-events-presenter.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersByTypeModel from './model/offers-by-type-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
// import PointsApiService from './model/points-api-service.js';

// const AUTHORIZATION = 'Basic hgjhg23gjhui1243yuhg3hgf3';
// const END_POINT = 'https://18.ecmascript.pages.academy/task-manager';

const siteHeaderElement = document.querySelector('.page-header');
const siteMainElement = document.querySelector('.page-main');
const tripFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');
const tripEventsElement = siteMainElement.querySelector('.trip-events');
const newEventBtn = document.querySelector('.trip-main__event-add-btn');

// const pointsModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const offersByTypeModel = new OffersByTypeModel();
const tripEventsPresenter = new TripEventsPresenter(tripEventsElement,
  pointsModel,
  offersModel,
  destinationsModel,
  offersByTypeModel,
  filterModel);
const filterPresenter = new FilterPresenter(tripFiltersElement, filterModel, pointsModel);

const handleNewEventFormClose = () => {
  newEventBtn.disabled = false;
};

const handleNewEventButtonClick = () => {
  tripEventsPresenter.createPoint(handleNewEventFormClose);
  newEventBtn.disabled = true;
};

newEventBtn.addEventListener('click', handleNewEventButtonClick);

tripEventsPresenter.init();
filterPresenter.init();
