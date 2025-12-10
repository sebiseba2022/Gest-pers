import { state } from './state.js';

export function handleCopy() {
  if (!state.selectedPerson) return;
  
  const p = state.selectedPerson;
  const text = `${p.prenume} ${p.nume}, CNP ${p.cnp}, deține actul de identitate seria ${p.seria} nr. ${p.numar}, emis la data de ${p.emis}, cu domiciliul în ${p.adresa}.`;
  
  navigator.clipboard.writeText(text).then(() => {
    alert('Datele au fost copiate în clipboard!');
  });
}
