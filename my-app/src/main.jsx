import './style.css';

// State management
let state = {
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

// Helper functions
function getFilteredPersons() {
  return state.persons.filter(p => 
    `${p.nume} ${p.prenume}`.toLowerCase().includes(state.searchTerm.toLowerCase())
  );
}

function validateForm() {
  const errors = {};
  const { nume, prenume, cnp, seria, numar, emis, valabil, adresa } = state.formData;
  
  if (!nume?.trim()) errors.nume = 'Numele este obligatoriu';
  if (!prenume?.trim()) errors.prenume = 'Prenumele este obligatoriu';
  
  if (!cnp?.trim()) {
    errors.cnp = 'CNP-ul este obligatoriu';
  } else if (!/^\d{13}$/.test(cnp)) {
    errors.cnp = 'CNP-ul trebuie să conțină exact 13 cifre';
  }
  
  if (!seria?.trim()) {
    errors.seria = 'Seria este obligatorie';
  } else if (!/^[A-Z]{2}$/.test(seria)) {
    errors.seria = 'Seria trebuie să conțină exact 2 litere mari';
  }
  
  if (!numar?.trim()) {
    errors.numar = 'Numărul este obligatoriu';
  } else if (!/^\d{6}$/.test(numar)) {
    errors.numar = 'Numărul trebuie să conțină exact 6 cifre';
  }
  
  if (!emis) errors.emis = 'Data emiterii este obligatorie';
  if (!valabil) errors.valabil = 'Data valabilității este obligatorie';
  
  if (emis && valabil && emis >= valabil) {
    errors.valabil = 'Data valabilității trebuie să fie după data emiterii';
  }
  
  if (!adresa?.trim()) errors.adresa = 'Adresa este obligatorie';
  
  state.formErrors = errors;
  return Object.keys(errors).length === 0;
}

// Event handlers
function handleSearch(e) {
  state.searchTerm = e.target.value;
  render();
}

function handleSelectPerson(person) {
  state.selectedPerson = person;
  render();
}

function handleAdd() {
  state.editingPerson = null;
  state.formData = {
    nume: '',
    prenume: '',
    cnp: '',
    seria: '',
    numar: '',
    emis: '',
    valabil: '',
    adresa: '',
    photo: null
  };
  state.formErrors = {};
  showDialog('addEditDialog');
}

function handleEdit() {
  if (!state.selectedPerson) return;
  state.editingPerson = state.selectedPerson;
  state.formData = { ...state.selectedPerson };
  state.formErrors = {};
  showDialog('addEditDialog');
}

function handleDelete() {
  if (!state.selectedPerson) return;
  showDialog('deleteDialog');
}

function handleCopy() {
  if (!state.selectedPerson) return;
  
  const p = state.selectedPerson;
  const text = `${p.prenume} ${p.nume}, CNP ${p.cnp}, deține actul de identitate seria ${p.seria} nr. ${p.numar}, emis la data de ${p.emis}, cu domiciliul în ${p.adresa}.`;
  
  navigator.clipboard.writeText(text).then(() => {
    alert('Datele au fost copiate în clipboard!');
  });
}

function handleSave() {
  if (!validateForm()) {
    render();
    return;
  }
  
  if (state.editingPerson) {
    state.persons = state.persons.map(p => 
      p.id === state.editingPerson.id ? { ...state.formData, id: p.id } : p
    );
    if (state.selectedPerson?.id === state.editingPerson.id) {
      state.selectedPerson = { ...state.formData, id: state.editingPerson.id };
    }
  } else {
    const newPerson = { ...state.formData, id: Date.now() };
    state.persons.push(newPerson);
  }
  
  hideDialog('addEditDialog');
  render();
}

function confirmDelete() {
  state.persons = state.persons.filter(p => p.id !== state.selectedPerson.id);
  state.selectedPerson = null;
  hideDialog('deleteDialog');
  render();
}

function handlePhotoUpload(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      state.formData.photo = reader.result;
      render();
    };
    reader.readAsDataURL(file);
  }
}

function removePhoto() {
  state.formData.photo = null;
  render();
}

function updateFormField(field, value) {
  state.formData[field] = value;
  if (state.formErrors[field]) {
    delete state.formErrors[field];
  }
}

// Dialog management
function showDialog(dialogId) {
  document.getElementById(dialogId).style.display = 'flex';
  render();
}

function hideDialog(dialogId) {
  document.getElementById(dialogId).style.display = 'none';
}

// Render function
function render() {
  const app = document.getElementById('app');
  const filteredPersons = getFilteredPersons();
  
  app.innerHTML = `
    <div class="app-container">
      <!-- Left Panel -->
      <div class="left-panel">
        <!-- Buttons -->
        <div class="button-bar">
          <button id="addBtn" class="btn btn-primary">
            <span class="icon">+</span>
            <span>Add</span>
          </button>
          <button id="deleteBtn" class="btn btn-danger" ${!state.selectedPerson ? 'disabled' : ''}>
            <span class="icon">🗑</span>
          </button>
          <button id="copyBtn" class="btn btn-success" ${!state.selectedPerson ? 'disabled' : ''}>
            <span class="icon">📋</span>
          </button>
        </div>

        <!-- Search -->
        <div class="search-bar">
          <input 
            type="text" 
            id="searchInput" 
            placeholder="Caută persoană..." 
            value="${state.searchTerm}"
          />
        </div>

        <!-- Person List -->
        <div class="person-list">
          ${filteredPersons.map(person => `
            <div 
              class="person-item ${state.selectedPerson?.id === person.id ? 'selected' : ''}" 
              data-person-id="${person.id}"
            >
              <div class="person-name">${person.nume}, ${person.prenume}</div>
              <div class="person-cnp">CNP: ${person.cnp}</div>
            </div>
          `).join('')}
          ${filteredPersons.length === 0 ? '<div class="no-results">Nu s-au găsit persoane</div>' : ''}
        </div>
      </div>

      <!-- Right Panel -->
      <div class="right-panel">
        ${state.selectedPerson ? `
          <div class="details-card">
            <div class="details-header">
              <h2>Date Personale</h2>
              ${state.selectedPerson.photo ? `
                <div class="photo-container">
                  <img src="${state.selectedPerson.photo}" alt="Act identitate" />
                </div>
              ` : `
                <div class="photo-placeholder">
                  <span class="icon-user">👤</span>
                </div>
              `}
            </div>

            <div class="details-content">
              <div class="detail-row">
                <div class="detail-item">
                  <label>Nume</label>
                  <p>${state.selectedPerson.nume}</p>
                </div>
                <div class="detail-item">
                  <label>Prenume</label>
                  <p>${state.selectedPerson.prenume}</p>
                </div>
              </div>

              <div class="detail-item">
                <label>CNP</label>
                <p>${state.selectedPerson.cnp}</p>
              </div>

              <div class="detail-row">
                <div class="detail-item">
                  <label>Seria</label>
                  <p>${state.selectedPerson.seria}</p>
                </div>
                <div class="detail-item">
                  <label>Număr</label>
                  <p>${state.selectedPerson.numar}</p>
                </div>
              </div>

              <div class="detail-row">
                <div class="detail-item">
                  <label>Data Emiterii</label>
                  <p>${state.selectedPerson.emis}</p>
                </div>
                <div class="detail-item">
                  <label>Valabil până la</label>
                  <p>${state.selectedPerson.valabil}</p>
                </div>
              </div>

              <div class="detail-item">
                <label>Adresă</label>
                <p>${state.selectedPerson.adresa}</p>
              </div>
            </div>
          </div>
        ` : `
          <div class="empty-state">
            <span class="icon-user-large">👤</span>
            <p>Selectați o persoană din listă</p>
          </div>
        `}
      </div>
    </div>

    <!-- Add/Edit Dialog -->
    <div id="addEditDialog" class="dialog">
      <div class="dialog-content">
        <div class="dialog-header">
          <h3>${state.editingPerson ? 'Editează Persoana' : 'Adaugă Persoană Nouă'}</h3>
          <button class="close-btn" onclick="hideDialog('addEditDialog')">×</button>
        </div>

        <div class="dialog-body">
          <div class="form-row">
            <div class="form-group">
              <label>Nume *</label>
              <input 
                type="text" 
                id="numeInput" 
                value="${state.formData.nume || ''}"
                class="${state.formErrors.nume ? 'error' : ''}"
              />
              ${state.formErrors.nume ? `<span class="error-msg">${state.formErrors.nume}</span>` : ''}
            </div>

            <div class="form-group">
              <label>Prenume *</label>
              <input 
                type="text" 
                id="prenumeInput" 
                value="${state.formData.prenume || ''}"
                class="${state.formErrors.prenume ? 'error' : ''}"
              />
              ${state.formErrors.prenume ? `<span class="error-msg">${state.formErrors.prenume}</span>` : ''}
            </div>
          </div>

          <div class="form-group">
            <label>CNP *</label>
            <input 
              type="text" 
              id="cnpInput" 
              value="${state.formData.cnp || ''}"
              maxlength="13"
              class="${state.formErrors.cnp ? 'error' : ''}"
            />
            ${state.formErrors.cnp ? `<span class="error-msg">${state.formErrors.cnp}</span>` : ''}
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Seria *</label>
              <input 
                type="text" 
                id="seriaInput" 
                value="${state.formData.seria || ''}"
                maxlength="2"
                class="${state.formErrors.seria ? 'error' : ''}"
              />
              ${state.formErrors.seria ? `<span class="error-msg">${state.formErrors.seria}</span>` : ''}
            </div>

            <div class="form-group">
              <label>Număr *</label>
              <input 
                type="text" 
                id="numarInput" 
                value="${state.formData.numar || ''}"
                maxlength="6"
                class="${state.formErrors.numar ? 'error' : ''}"
              />
              ${state.formErrors.numar ? `<span class="error-msg">${state.formErrors.numar}</span>` : ''}
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Data Emiterii *</label>
              <input 
                type="date" 
                id="emisInput" 
                value="${state.formData.emis || ''}"
                class="${state.formErrors.emis ? 'error' : ''}"
              />
              ${state.formErrors.emis ? `<span class="error-msg">${state.formErrors.emis}</span>` : ''}
            </div>

            <div class="form-group">
              <label>Valabil până la *</label>
              <input 
                type="date" 
                id="validInput" 
                value="${state.formData.valabil || ''}"
                class="${state.formErrors.valabil ? 'error' : ''}"
              />
              ${state.formErrors.valabil ? `<span class="error-msg">${state.formErrors.valabil}</span>` : ''}
            </div>
          </div>

          <div class="form-group">
            <label>Adresă *</label>
            <textarea 
              id="adresaInput" 
              rows="3"
              class="${state.formErrors.adresa ? 'error' : ''}"
            >${state.formData.adresa || ''}</textarea>
            ${state.formErrors.adresa ? `<span class="error-msg">${state.formErrors.adresa}</span>` : ''}
          </div>

          <div class="form-group">
            <label>Poză Act Identitate</label>
            <div class="photo-upload">
              <label class="upload-btn">
                📤 Încarcă Poză
                <input type="file" id="photoInput" accept="image/*" style="display: none;" />
              </label>
              ${state.formData.photo ? `
                <div class="photo-preview">
                  <img src="${state.formData.photo}" alt="Preview" />
                  <button class="remove-photo-btn" id="removePhotoBtn">×</button>
                </div>
              ` : ''}
            </div>
          </div>
        </div>

        <div class="dialog-footer">
          <button class="btn btn-secondary" onclick="hideDialog('addEditDialog')">Anulează</button>
          <button class="btn btn-primary" id="saveBtn">Salvează</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <div id="deleteDialog" class="dialog">
      <div class="dialog-content small">
        <div class="dialog-header">
          <h3>Confirmare Ștergere</h3>
          <button class="close-btn" onclick="hideDialog('deleteDialog')">×</button>
        </div>

        <div class="dialog-body">
          <p>Sigur doriți să ștergeți persoana <strong>${state.selectedPerson?.nume} ${state.selectedPerson?.prenume}</strong>? Această acțiune nu poate fi anulată.</p>
        </div>

        <div class="dialog-footer">
          <button class="btn btn-secondary" onclick="hideDialog('deleteDialog')">Anulează</button>
          <button class="btn btn-danger" id="confirmDeleteBtn">Șterge</button>
        </div>
      </div>
    </div>
  `;

  // Attach event listeners
  attachEventListeners();
}

function attachEventListeners() {
  // Search
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
  }

  // Buttons
  const addBtn = document.getElementById('addBtn');
  if (addBtn) addBtn.addEventListener('click', handleAdd);

  const deleteBtn = document.getElementById('deleteBtn');
  if (deleteBtn) deleteBtn.addEventListener('click', handleDelete);

  const copyBtn = document.getElementById('copyBtn');
  if (copyBtn) copyBtn.addEventListener('click', handleCopy);

  // Person list
  document.querySelectorAll('.person-item').forEach(item => {
    const personId = parseInt(item.dataset.personId);
    const person = state.persons.find(p => p.id === personId);
    
    item.addEventListener('click', () => handleSelectPerson(person));
    item.addEventListener('dblclick', () => {
      handleSelectPerson(person);
      handleEdit();
    });
  });

  // Form inputs
  const numeInput = document.getElementById('numeInput');
  if (numeInput) numeInput.addEventListener('input', (e) => updateFormField('nume', e.target.value));

  const prenumeInput = document.getElementById('prenumeInput');
  if (prenumeInput) prenumeInput.addEventListener('input', (e) => updateFormField('prenume', e.target.value));

  const cnpInput = document.getElementById('cnpInput');
  if (cnpInput) cnpInput.addEventListener('input', (e) => updateFormField('cnp', e.target.value));

  const seriaInput = document.getElementById('seriaInput');
  if (seriaInput) seriaInput.addEventListener('input', (e) => updateFormField('seria', e.target.value.toUpperCase()));

  const numarInput = document.getElementById('numarInput');
  if (numarInput) numarInput.addEventListener('input', (e) => updateFormField('numar', e.target.value));

  const emisInput = document.getElementById('emisInput');
  if (emisInput) emisInput.addEventListener('input', (e) => updateFormField('emis', e.target.value));

  const validInput = document.getElementById('validInput');
  if (validInput) validInput.addEventListener('input', (e) => updateFormField('valabil', e.target.value));

  const adresaInput = document.getElementById('adresaInput');
  if (adresaInput) adresaInput.addEventListener('input', (e) => updateFormField('adresa', e.target.value));

  const photoInput = document.getElementById('photoInput');
  if (photoInput) photoInput.addEventListener('change', handlePhotoUpload);

  const removePhotoBtn = document.getElementById('removePhotoBtn');
  if (removePhotoBtn) removePhotoBtn.addEventListener('click', removePhoto);

  const saveBtn = document.getElementById('saveBtn');
  if (saveBtn) saveBtn.addEventListener('click', handleSave);

  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  if (confirmDeleteBtn) confirmDeleteBtn.addEventListener('click', confirmDelete);
}

// Make hideDialog available globally
window.hideDialog = hideDialog;

// Initialize app
render();