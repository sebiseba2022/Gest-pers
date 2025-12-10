import { state, getFilteredPersons } from './state.js';
import { handleSearch, handleSelectPerson } from './search.js';
import { handleAdd, handleEdit, handleSave, handlePhotoUpload, removePhoto } from './add.js';
import { handleDelete, confirmDelete } from './delete.js';
import { handleCopy } from './clipboard.js';
import { updateFormField, hideDialog } from './validation.js';

export function render() {
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
          <button id="editBtn" class="btn btn-info" ${!state.selectedPerson ? 'disabled' : ''}>
            <span class="icon">✏️</span>
            <span>Edit</span>
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
          <button class="close-btn" onclick="window.hideDialogGlobal('addEditDialog')">×</button>
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
          <button class="btn btn-secondary" onclick="window.hideDialogGlobal('addEditDialog')">Anulează</button>
          <button class="btn btn-primary" id="saveBtn">Salvează</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <div id="deleteDialog" class="dialog">
      <div class="dialog-content small">
        <div class="dialog-header">
          <h3>Confirmare Ștergere</h3>
          <button class="close-btn" onclick="window.hideDialogGlobal('deleteDialog')">×</button>
        </div>

        <div class="dialog-body">
          <p>Sigur doriți să ștergeți persoana <strong>${state.selectedPerson?.nume} ${state.selectedPerson?.prenume}</strong>? Această acțiune nu poate fi anulată.</p>
        </div>

        <div class="dialog-footer">
          <button class="btn btn-secondary" onclick="window.hideDialogGlobal('deleteDialog')">Anulează</button>
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

  const editBtn = document.getElementById('editBtn');
  if (editBtn) editBtn.addEventListener('click', handleEdit);

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
