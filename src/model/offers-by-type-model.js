import { generateOffersByType } from '../mock/offers-by-type.js';

export default class OffersByTypeModel {
  offersByType = Array.from({ length: 40 }, generateOffersByType);

  getOffersByType = () => this.offersByType;
}
