import { saveFormToLocalStorage, clearFormFromLocalStorage } from "../services/localStorageService";
import { FormAction, FormState } from "../types";
import { validateForm } from "../services/validationService";


export const formReducer = (state: FormState, action: FormAction): FormState => {
  let newState: FormState = state;

  switch (action.type) {
    case "ADD_QUESTION":
      newState = { ...state, questions: [...state.questions, action.payload] };
      break;

    case "REPLACE_QUESTION":
        newState = {
            ...state,
            questions: state.questions.map((q) => 
            q.id === action.payload.id ? {...action.payload} : q)
        }
        break;
    case "UPDATE_QUESTION":
      newState = {
        ...state,
        questions: state.questions.map((q) =>
          q.id === action.payload.id ? { ...q, [action.payload.field]: action.payload.value } : q
        ),
      };
      break;

    case "DELETE_QUESTION":
      newState = { ...state, questions: state.questions.filter((q) => q.id !== action.payload) };
      break;

    case "SET_FORM_NAME":
      newState = { ...state, formName: action.payload };
      break;

    case "LOAD_FORM":
      return action.payload;

    case "RESET_FORM":
      clearFormFromLocalStorage();
      return { formName: "", questions: [] };

    case "START_SAVING":
      return {
        ...state,
        questions: state.questions.map((q) =>
          q.id === action.payload ? { ...q, isSaving: true } : q
        ),
      };

    case "FINISH_SAVING":
      return {
        ...state,
        questions: state.questions.map((q) =>
          q.id === action.payload ? { ...q, isSaving: false } : q
        ),
      };

    default:
      return state;
  }

  if (shouldSaveToLocalStorage(action.type)) {
    saveIfValid(newState);
  }

  return newState;
};

const shouldSaveToLocalStorage = (actionType: string): boolean => {
  return ["ADD_QUESTION", "REPLACE_QUESTION", "UPDATE_QUESTION", "DELETE_QUESTION", "SET_FORM_NAME"].includes(actionType);
};

const saveIfValid = (state: FormState) => {
  const errors = validateForm(state.questions);
  if (!errors.some((err) => Object.keys(err).length > 0)) {
    saveFormToLocalStorage(state);
  }
};
