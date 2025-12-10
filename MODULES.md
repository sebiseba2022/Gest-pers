# Gest-Pers - Modular Architecture

## Project Structure

The application has been refactored into separate, focused JavaScript modules for better maintainability and organization.

### Modules Overview

```
src/
├── main.js           - Entry point, initializes the app
├── state.js          - State management and data handling
├── render.js         - UI rendering and event listener attachment
├── validation.js     - Form validation and dialog utilities
├── add.js            - Add/Edit person functionality
├── delete.js         - Delete person functionality
├── search.js         - Search and filter functionality
├── clipboard.js      - Copy to clipboard functionality
└── style.css         - Styling
```

### Module Descriptions

#### `state.js`
- **Responsibility**: Manages application state
- **Exports**:
  - `state`: Global state object containing persons, form data, and UI state
  - `getFilteredPersons()`: Returns filtered persons based on search term
  - `updateState()`: Helper to update state

#### `validation.js`
- **Responsibility**: Form validation and dialog management
- **Exports**:
  - `validateForm()`: Validates form fields and returns errors
  - `updateFormField()`: Updates form field and clears its error
  - `showDialog()`: Shows a dialog by ID
  - `hideDialog()`: Hides a dialog by ID

#### `render.js`
- **Responsibility**: Renders the entire UI and attaches event listeners
- **Exports**:
  - `render()`: Main render function that updates the DOM

#### `add.js`
- **Responsibility**: Add and Edit person functionality
- **Exports**:
  - `handleAdd()`: Opens add dialog with empty form
  - `handleEdit()`: Opens edit dialog with selected person's data
  - `handleSave()`: Validates and saves person data
  - `handlePhotoUpload()`: Handles photo file upload
  - `removePhoto()`: Removes uploaded photo

#### `delete.js`
- **Responsibility**: Delete person functionality
- **Exports**:
  - `handleDelete()`: Opens delete confirmation dialog
  - `confirmDelete()`: Confirms and deletes selected person

#### `search.js`
- **Responsibility**: Search and filter functionality
- **Exports**:
  - `handleSearch()`: Updates search term and re-renders
  - `handleSelectPerson()`: Selects a person and updates display

#### `clipboard.js`
- **Responsibility**: Copy person data to clipboard
- **Exports**:
  - `handleCopy()`: Copies formatted person data to clipboard

#### `main.js`
- **Responsibility**: Application entry point
- **Actions**:
  - Imports CSS styles
  - Imports render function
  - Makes `hideDialogGlobal()` available globally
  - Initializes the app by calling `render()`

## Features

- ✅ **Add Person**: Create new person records with validation
- ✅ **Edit Person**: Modify existing person data
- ✅ **Delete Person**: Remove person with confirmation dialog
- ✅ **Search**: Filter persons by name
- ✅ **Photo Upload**: Attach identity document photos
- ✅ **Copy to Clipboard**: Export person data as formatted text
- ✅ **Form Validation**: Real-time validation with error messages

## Data Model

```javascript
{
  id: number,
  nume: string,
  prenume: string,
  cnp: string (13 digits),
  seria: string (2 uppercase letters),
  numar: string (6 digits),
  emis: date,
  valabil: date,
  adresa: string,
  photo: base64 image or null
}
```

## Development

Each module is independent and can be modified without affecting others. Follow these principles:

1. Keep modules focused on a single responsibility
2. Export only public functions
3. Import what you need from other modules
4. Use the state module to access/modify shared data
5. Call `render()` after state changes to update the UI
