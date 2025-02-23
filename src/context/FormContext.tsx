import React, { createContext, useReducer, ReactNode, useEffect } from "react";
import { FormContextProps, FormState } from "../types";
import { formReducer } from "./formReducer";
import { loadFormFromLocalStorage } from "../services/localStorageService";

const initialState: FormState = {
  formName: "",
  questions: [],
};

export const FormContext = createContext<FormContextProps | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  useEffect(() => {
    const fetchForm = async () => {
      const savedForm = await loadFormFromLocalStorage();
      if (savedForm) {
        dispatch({ type: "LOAD_FORM", payload: savedForm });
      }
    };

    fetchForm();
  }, []); 

  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
};
