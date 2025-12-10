import { state, updateState } from './state.js';
import { render } from './render.js';

export function handleSearch(e) {
  state.searchTerm = e.target.value;
  render();
}

export function handleSelectPerson(person) {
  state.selectedPerson = person;
  render();
}
