import './style.css';
import { render } from './render.js';
import { hideDialog } from './validation.js';
import { initializeApp } from './state.js';

// Make hideDialog available globally for inline onclick handlers
window.hideDialogGlobal = hideDialog;

// Initialize app with data from database
initializeApp().then(() => {
  render();
});