import { state, deletePersonFromDatabase } from './state.js';
import { render } from './render.js';
import { showDialog, hideDialog } from './validation.js';

export function handleDelete() {
  if (!state.selectedPerson) return;
  showDialog('deleteDialog');
}

export async function confirmDelete() {
  const personId = state.selectedPerson.id;
  const success = await deletePersonFromDatabase(personId);
  
  if (success) {
    state.selectedPerson = null;
    hideDialog('deleteDialog');
    render();
  } else {
    alert('Eroare la ștergere! Încercați din nou.');
  }
}
