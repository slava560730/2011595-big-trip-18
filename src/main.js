import HeaderPresenter from './presenter/header-presenter.js';
import TripEventsPresenter from './presenter/trip-events-presenter.js';

const siteHeaderElement = document.querySelector('.page-header');
const siteMainElement = document.querySelector('.page-main');
const tripFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');
const tripMainElement = siteHeaderElement.querySelector('.trip-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');

const headerPresenter = new HeaderPresenter();
const tripEventsPresenter = new TripEventsPresenter();
headerPresenter.init(tripMainElement, tripFiltersElement);
tripEventsPresenter.init(tripEventsElement);
