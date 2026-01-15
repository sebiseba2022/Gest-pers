import { state, addPersonToDatabase, updatePersonInDatabase } from './state.js';
import { render } from './render.js';
import { showDialog, hideDialog, validateForm } from './validation.js';

export function handleAdd() {
  state.editingPerson = null;
  state.formData = {
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
  };
  state.formErrors = {};
  render();
  showDialog('addEditDialog');
}

export function handleEdit() {
  if (!state.selectedPerson) return;
  state.editingPerson = state.selectedPerson;
  state.formData = {
    id: state.selectedPerson.id ?? null,
    nume: state.selectedPerson.nume ?? '',
    prenume: state.selectedPerson.prenume ?? '',
    cnp: state.selectedPerson.cnp ?? '',
    seria: state.selectedPerson.seria ?? '',
    numar: state.selectedPerson.numar ?? '',
    emis: state.selectedPerson.emis ?? '',
    valabil: state.selectedPerson.valabil ?? '',
    adresa: state.selectedPerson.adresa ?? '',
    photo: state.selectedPerson.photo ?? null
  };
  state.formErrors = {};
  render();
  showDialog('addEditDialog');
}

export async function handleSave() {
  if (!validateForm()) {
    render();
    return;
  }
  
  if (state.editingPerson) {
    // Update existing person
    const updatedPerson = { ...state.formData, id: state.editingPerson.id };
    const success = await updatePersonInDatabase(updatedPerson);
    if (success) {
      state.selectedPerson = updatedPerson;
    }
  } else {
    // Add new person
    const newPerson = { ...state.formData };
    const success = await addPersonToDatabase(newPerson);
    if (success) {
      state.selectedPerson = newPerson;
    }
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
