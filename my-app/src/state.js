// State management
export let state = {
  persons: [
    {
      id: 1,
      nume: 'Popescu',
      prenume: 'Ion',
      cnp: '1850312123456',
      seria: 'RX',
      numar: '123456',
      emis: '2020-01-15',
      valabil: '2030-01-15',
      adresa: 'Str. Mihai Viteazu nr. 10, Sibiu',
      photo: null
    }
  ],
  searchTerm: '',
  selectedPerson: null,
  editingPerson: null,
  formData: {},
  formErrors: {}
};

export function getFilteredPersons() {
  return state.persons.filter(p => 
    `${p.nume} ${p.prenume}`.toLowerCase().includes(state.searchTerm.toLowerCase())
  );
}

export function updateState(newState) {
  Object.assign(state, newState);
}
