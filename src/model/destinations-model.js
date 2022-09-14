import { generateDestTest} from '../mock/destination.js';


export default class DestinationsModel {
  #destinations = generateDestTest();

  get destinations() {
    return this.#destinations;
  }
}
