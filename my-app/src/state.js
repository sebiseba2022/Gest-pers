const API_URL = 'http://localhost/gest-pers-final/Gest-pers/api.php';

// State management
export let state = {
  persons: [],
  searchTerm: '',
  selectedPerson: null,
  editingPerson: null,
  formData: {
    id: null,
    nume: '',
    prenume: '',
    cnp: '',
    seria: '',
    numar: '',
    emis: '',
    valabil: '',
    adresa: '',
    photo: null
  },
  formErrors: {},
  isEditing: false,
  loading: false
};

export async function initializeApp() {
  state.loading = true;
  try {
    const response = await fetch(`${API_URL}?action=get_all`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const persons = await response.json();
    state.persons = Array.isArray(persons)
      ? persons.map((p) => ({ ...p, id: Number(p.id) }))
      : [];
  } catch (error) {
    console.error('Error loading persons:', error);
    state.persons = [];
  }
  state.loading = false;
}

export function getFilteredPersons() {
  return state.persons.filter(p => 
    `${p.nume} ${p.prenume}`.toLowerCase().includes(state.searchTerm.toLowerCase())
  );
}

export function updateState(newState) {
  Object.assign(state, newState);
}

export async function addPersonToDatabase(person) {
  try {
    const response = await fetch(`${API_URL}?action=add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(person)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (result.id) {
      const created = { ...person, id: Number(result.id) };
      state.persons.push(created);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding person:', error);
    return false;
  }
}

export async function updatePersonInDatabase(person) {
  try {
    const response = await fetch(`${API_URL}?action=update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(person)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (result.success) {
      const personId = Number(person.id);
      const index = state.persons.findIndex((p) => Number(p.id) === personId);
      if (index !== -1) {
        state.persons[index] = { ...person, id: personId };
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating person:', error);
    return false;
  }
}

export async function deletePersonFromDatabase(id) {
  try {
    const personId = Number(id);
    const response = await fetch(`${API_URL}?action=delete&id=${id}`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (result.success) {
      state.persons = state.persons.filter((p) => Number(p.id) !== personId);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting person:', error);
    return false;
  }
}
