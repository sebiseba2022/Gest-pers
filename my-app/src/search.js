import { state } from './state.js';
import { render } from './render.js';

let isSearching = false;

export function handleSearch(e) {
  isSearching = true;
  state.searchTerm = e.target.value;
  render();
  
  // Refocus și restore cursor position
  setTimeout(() => {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.focus();
      searchInput.setSelectionRange(e.target.value.length, e.target.value.length);
    }
  }, 0);
}

export function handleSelectPerson(person) {
  isSearching = false;
  state.selectedPerson = person;
  render();
}
