import './style.css';
import { render } from './render.js';
import { hideDialog } from './validation.js';

// Make hideDialog available globally for inline onclick handlers
window.hideDialogGlobal = hideDialog;

// Initialize app
render();