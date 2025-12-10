import { state } from './state.js';
import { render } from './render.js';
import { showDialog, hideDialog } from './validation.js';

export function handleDelete() {
  if (!state.selectedPerson) return;
  showDialog('deleteDialog');
}

export function confirmDelete() {
  state.persons = state.persons.filter(p => p.id !== state.selectedPerson.id);
  state.selectedPerson = null;
  hideDialog('deleteDialog');
  render();
}
