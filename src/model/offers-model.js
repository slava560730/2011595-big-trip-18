import { generateOffer } from '../mock/offers.js';

export default class OffersModel {
  offers = Array.from({ length: 40 }, generateOffer);

  getOffers = () => this.offers;
}
