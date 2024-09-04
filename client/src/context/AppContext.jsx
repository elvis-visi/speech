// context - It's a way for a parent component provide data to the entire tree below it
//reducer - takes current state and an action as args, retuns a new state
import React, { createContext, useReducer, useContext } from 'react';

/**
 * @typedef {Object} AppState
 * @property {Object|null} user - The current user object or null if not logged in
 * @property {Array} transcriptions - An array of all transcriptions
 * @property {string} currentTranscription - The current transcription in progress
 * @property {boolean} isRecording - Whether the app is currently recording
 */

/** @type {AppState} */
const initialState = {
  user: null,
  transcriptions: [],
  currentTranscription: '',
  isRecording: false,
};

/**
 * @typedef {Object} Action
 * @property {string} type - The type of action to perform
 * @property {*} payload - The data associated with the action
 */

/**
 * The main application context
 * @type {React.Context<{state: AppState, dispatch: function(Action): void}>}
 */
const AppContext = createContext();

/**
 * Reducer function to handle state updates
 * @param {AppState} state - The current state
 * @param {Action} action - The action to perform
 * @returns {AppState} The new state
 */
function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_TRANSCRIPTIONS':
      return { ...state, transcriptions: action.payload };
    case 'ADD_TRANSCRIPTION':
      return { ...state, transcriptions: [...state.transcriptions, action.payload] };
    case 'UPDATE_TRANSCRIPTION':
      return {
        ...state,
        transcriptions: state.transcriptions.map(t => 
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'DELETE_TRANSCRIPTION':
      return {
        ...state,
        transcriptions: state.transcriptions.filter(t => t.id !== action.payload),
      };
    case 'SET_CURRENT_TRANSCRIPTION':
      return { ...state, currentTranscription: action.payload };
    case 'SET_IS_RECORDING':
      return { ...state, isRecording: action.payload };
    default:
      return state;
  }
}

/**
 * Provider component that wraps the app and provides the global state
 * @param {Object} props
 * @param {React.ReactNode} props.children - The child components to wrap
 * @returns {React.ReactElement} The provider component
 */
export function AppProvider({ children }) {
    // state- current state, dispatch - function you can send/dispatch actions to the reducer
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
