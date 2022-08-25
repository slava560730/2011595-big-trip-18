import { generateDestination } from '../mock/destination.js';

export default class DestinationsModel {
  #destinations = Array.from({ length: 40 }, generateDestination);

  get destinations() {
    return this.#destinations;
  }
}
