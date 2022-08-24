import HeaderPresenter from './presenter/header-presenter.js';
import TripEventsPresenter from './presenter/trip-events-presenter.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersByTypeModel from './model/offers-by-type-model.js';

const siteHeaderElement = document.querySelector('.page-header');
const siteMainElement = document.querySelector('.page-main');
const tripFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');
const tripMainElement = siteHeaderElement.querySelector('.trip-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');

const headerPresenter = new HeaderPresenter();
const tripEventsPresenter = new TripEventsPresenter();
const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const offersByTypeModel = new OffersByTypeModel();

headerPresenter.init(tripMainElement, tripFiltersElement);
tripEventsPresenter.init(
  tripEventsElement,
  pointsModel,
  offersModel,
  destinationsModel,
  offersByTypeModel
);
