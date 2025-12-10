import { state, updateState } from './state.js';

export function validateForm() {
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

export function updateFormField(field, value) {
  state.formData[field] = value;
  if (state.formErrors[field]) {
    delete state.formErrors[field];
  }
}

export function showDialog(dialogId) {
  document.getElementById(dialogId).style.display = 'flex';
}

export function hideDialog(dialogId) {
  document.getElementById(dialogId).style.display = 'none';
}
