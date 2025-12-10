import { state } from './state.js';
import { render } from './render.js';
import { showDialog, hideDialog, validateForm } from './validation.js';

export function handleAdd() {
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

export function handleEdit() {
  if (!state.selectedPerson) return;
  state.editingPerson = state.selectedPerson;
  state.formData = { ...state.selectedPerson };
  state.formErrors = {};
  showDialog('addEditDialog');
}

export function handleSave() {
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

export function handlePhotoUpload(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      state.formData.photo = reader.result;
      // Update the preview without full re-render
      updatePhotoPreview();
    };
    reader.readAsDataURL(file);
  }
}

function updatePhotoPreview() {
  const photoUploadDiv = document.querySelector('.photo-upload');
  if (!photoUploadDiv) return;
  
  if (state.formData.photo) {
    const previewHTML = `
      <label class="upload-btn">
        📤 Încarcă Poză
        <input type="file" id="photoInput" accept="image/*" style="display: none;" />
      </label>
      <div class="photo-preview">
        <img src="${state.formData.photo}" alt="Preview" />
        <button class="remove-photo-btn" id="removePhotoBtn">×</button>
      </div>
    `;
    photoUploadDiv.innerHTML = previewHTML;
    
    const photoInput = photoUploadDiv.querySelector('#photoInput');
    if (photoInput) {
      photoInput.addEventListener('change', handlePhotoUpload);
    }
    
    const removePhotoBtn = photoUploadDiv.querySelector('#removePhotoBtn');
    if (removePhotoBtn) {
      removePhotoBtn.addEventListener('click', removePhoto);
    }
  }
}

export function removePhoto() {
  state.formData.photo = null;
  const photoUploadDiv = document.querySelector('.photo-upload');
  if (!photoUploadDiv) return;
  
  const uploadHTML = `
    <label class="upload-btn">
      📤 Încarcă Poză
      <input type="file" id="photoInput" accept="image/*" style="display: none;" />
    </label>
  `;
  photoUploadDiv.innerHTML = uploadHTML;
  
  const photoInput = photoUploadDiv.querySelector('#photoInput');
  if (photoInput) {
    photoInput.addEventListener('change', handlePhotoUpload);
  }
}
